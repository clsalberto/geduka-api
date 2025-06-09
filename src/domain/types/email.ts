import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'
import { validateEmail } from '~/shared/utils/validation'

export class Email {
  private email: string

  private constructor(email: string) {
    this.validate(email)
    this.email = email
  }

  private validate(email: string) {
    const { error, message } = validateEmail(email)

    if (error)
      throw new NotificationError({
        message,
        code: HttpCode.FORBIDDEN,
      })
  }

  static create(email: string) {
    return new Email(email)
  }

  value() {
    return this.email
  }
}
