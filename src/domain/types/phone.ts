import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'
import { validatePhone } from '~/shared/utils/validation'

export class Phone {
  private phone: string

  private constructor(phone: string) {
    this.validate(phone)
    this.phone = phone
  }

  private validate(phone: string) {
    const { error, message } = validatePhone(phone)

    if (error)
      throw new NotificationError({
        message,
        code: HttpCode.FORBIDDEN,
      })
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
