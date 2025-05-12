import { NotificationError } from '~/shared/notification'

import { HttpCode } from '~/shared/http'

export class Email {
  private email: string

  private constructor(email: string) {
    this.validate(email)
    this.email = email
  }

  private validate(email: string) {
    const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)

    if (!regex.test(email)) {
      throw new NotificationError({
        message: 'Email invalid',
        code: HttpCode.FORBIDDEN,
      })
    }
  }

  static create(email: string) {
    return new Email(email)
  }

  value() {
    return this.email
  }
}
