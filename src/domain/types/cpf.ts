import { NotificationError } from '~/shared/notification'

import { HttpCode } from '~/shared/http'

export class CPF {
  private cpf: string

  private constructor(cpf: string) {
    this.validate(cpf)
    this.cpf = cpf
  }

  private validate(cpf: string) {
    const regex = new RegExp(/^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2})$/)

    if (!regex.test(cpf)) {
      throw new NotificationError({
        message: 'CPF: Invalid tax id',
        code: HttpCode.FORBIDDEN,
      })
    }
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
