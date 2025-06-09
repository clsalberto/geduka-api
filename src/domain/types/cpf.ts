import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'
import { validateCPF } from '~/shared/utils/validation'

export class CPF {
  private cpf: string

  private constructor(cpf: string) {
    this.validate(cpf)
    this.cpf = cpf
  }

  private validate(cpf: string) {
    const { error, message } = validateCPF(cpf)

    if (error)
      throw new NotificationError({
        message,
        code: HttpCode.FORBIDDEN,
      })
  }

  static create(cpf: string) {
    return new CPF(cpf)
  }

  value() {
    return this.cpf.replace(/\D/g, '')
  }

  formated() {
    return this.cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }
}
