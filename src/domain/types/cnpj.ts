import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'
import { validateCNPJ } from '~/shared/utils/validation'

export class CNPJ {
  private cnpj: string

  private constructor(cnpj: string) {
    this.validate(cnpj)
    this.cnpj = cnpj
  }

  private validate(cnpj: string) {
    const { error, message } = validateCNPJ(cnpj)

    if (error)
      throw new NotificationError({
        message,
        code: HttpCode.FORBIDDEN,
      })
  }

  static create(cnpj: string) {
    return new CNPJ(cnpj)
  }

  value() {
    return this.cnpj.replace(/\D/g, '')
  }

  formated() {
    return this.cnpj
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }
}
