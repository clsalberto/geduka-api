import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export class CNPJ {
  private cnpj: string

  private constructor(cnpj: string) {
    this.validate(cnpj)
    this.cnpj = cnpj
  }

  private validate(cnpj: string) {
    const regex = new RegExp(
      /^([0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/
    )

    if (!regex.test(cnpj)) {
      throw new NotificationError('CNPJ: Invalid tax id', HttpCode.FORBIDDEN)
    }
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
