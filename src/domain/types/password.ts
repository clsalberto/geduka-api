import { z } from 'zod'

import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export const PasswordSchema = z
  .string()
  .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  .refine(password => /[A-Z]/.test(password), {
    message: 'A senha deve conter pelo menos uma letra maiúscula',
  })
  .refine(password => /[a-z]/.test(password), {
    message: 'A senha deve conter pelo menos uma letra minúscula',
  })
  .refine(password => /[0-9]/.test(password), {
    message: 'A senha deve conter pelo menos um número',
  })
  .refine(password => /[^A-Za-z0-9]/.test(password), {
    message: 'A senha deve conter pelo menos um caractere especial',
  })

export class Password {
  private readonly password: string

  private constructor(password: string) {
    this.validate(password)
    this.password = password
  }

  static create(password: string) {
    return new Password(password)
  }

  private validate(password: string) {
    const { error } = PasswordSchema.safeParse(password)

    if (error) {
      throw new NotificationError({
        message: error.message,
        code: HttpCode.FORBIDDEN,
      })
    }
  }

  value() {
    return this.password
  }

  formated() {
    return '********'
  }
}
