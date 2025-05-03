import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export class Zip {
  private zip: string

  private constructor(zip: string) {
    this.validate(zip)
    this.zip = zip
  }

  private validate(zip: string) {
    const regex = new RegExp(/^([0-9]{5}\-?[0-9]{3})$/)

    if (!regex.test(zip)) {
      throw new NotificationError('Zip code invalid', HttpCode.FORBIDDEN)
    }
  }

  static create(zip: string) {
    return new Zip(zip)
  }

  value() {
    return this.zip.replace(/\D/g, '')
  }

  formated() {
    return this.zip
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  }
}
