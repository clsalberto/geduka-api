import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export class Email {
  private email: string

  private constructor(email: string) {
    this.validate(email)
    this.email = email
  }

  private validate(email: string) {
    const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)

    if (!regex.test(email)) {
      throw new NotificationError('Email invalid', HttpCode.FORBIDDEN)
    }
  }

  static create(email: string) {
    return new Email(email)
  }

  value() {
    return this.email
  }
}
