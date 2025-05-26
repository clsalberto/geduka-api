import { z } from 'zod'

import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export const PhoneSchema = z
  .string()
  .regex(/^(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/, {
    message: 'Telefone inválido: Erro no formato',
  })
  .refine(
    telefone => {
      // Remove caracteres não numéricos
      const numeros = telefone.replace(/\D/g, '')

      // Verifica se tem entre 10 e 11 dígitos (com DDD)
      if (numeros.length < 10 || numeros.length > 11) return false

      // Se tiver 11 dígitos, o primeiro dígito após o DDD deve ser 9 (celular)
      if (numeros.length === 11 && numeros.charAt(2) !== '9') return false

      // Verifica DDD válido (entre 11 e 99)
      const ddd = Number.parseInt(numeros.substring(0, 2))
      if (ddd < 11 || ddd > 99) return false

      return true
    },
    {
      message: 'Telefone inválido: DDD inválido',
    }
  )

export class Phone {
  private readonly phone: string

  private constructor(phone: string) {
    this.validate(phone)
    this.phone = phone
  }

  private validate(phone: string) {
    const { error } = PhoneSchema.safeParse(phone)

    if (error) {
      throw new NotificationError({
        message: error.message,
        code: HttpCode.FORBIDDEN,
      })
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
