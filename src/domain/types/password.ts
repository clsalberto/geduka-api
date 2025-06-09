import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'
import { validatePassword } from '~/shared/utils/validation'

export class Password {
  private password: string

  private constructor(password: string) {
    this.validate(password)
    this.password = password
  }

  static create(password: string) {
    return new Password(password)
  }

  private validate(password: string) {
    const { error, message } = validatePassword(password)

    if (error)
      throw new NotificationError({
        message,
        code: HttpCode.FORBIDDEN,
      })
  }

  value() {
    return this.password
  }

  formated() {
    return '********'
  }
}
