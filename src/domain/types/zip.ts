import { z } from 'zod'

import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export const ZipSchema = z
  .string()
  .regex(/^\d{5}-\d{3}$|^\d{8}$/, {
    message: 'CEP inválido: Formato esperado XXXXX-XXX ou XXXXXXXX',
  })
  .refine(
    cep => {
      // Remove caracteres não numéricos
      const numeros = cep.replace(/\D/g, '')

      // Verifica se tem 8 dígitos
      if (numeros.length !== 8) return false

      // Verifica se não são todos os dígitos iguais (ex: 00000-000)
      if (/^(\d)\1+$/.test(numeros)) return false

      return true
    },
    {
      message:
        'CEP inválido: Deve conter 8 dígitos e não pode ter todos os dígitos iguais',
    }
  )

export class Zip {
  private readonly zip: string

  private constructor(zip: string) {
    this.validate(zip)
    this.zip = zip
  }

  private validate(zip: string) {
    const { error } = ZipSchema.safeParse(zip)

    if (error) {
      throw new NotificationError({
        message: error.message,
        code: HttpCode.FORBIDDEN,
      })
    }
  }

  static create(zip: string) {
    return new Zip(zip)
  }

  value() {
    return this.zip.replace(/\D/g, '')
  }

  formated() {
    return this.zip.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2')
  }
}
