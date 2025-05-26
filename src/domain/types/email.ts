import { z } from 'zod'

import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export const EmailSchema = z.string().email({
  message: 'E-mail inválido',
})

export class Email {
  private readonly email: string

  private constructor(email: string) {
    this.validate(email)
    this.email = email
  }

  private validate(email: string) {
    const { error } = EmailSchema.safeParse(email)

    if (error) {
      throw new NotificationError({
        message: error.message,
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
