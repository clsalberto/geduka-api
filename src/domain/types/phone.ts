import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export class Phone {
  private phone: string

  private constructor(phone: string) {
    this.validate(phone)
    this.phone = phone
  }

  private validate(phone: string) {
    const regex = new RegExp(
      /^(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/
    )

    if (!regex.test(phone)) {
      throw new NotificationError('Phone invalid', HttpCode.FORBIDDEN)
    }
  }

  static create(phone: string) {
    return new Phone(phone)
  }

  value() {
    return this.phone.replace(/\D/g, '')
  }

  formated() {
    return this.phone
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }
}
