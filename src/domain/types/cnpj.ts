import { z } from 'zod'

import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export const CNPJSchema = z
  .string()
  .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$|^\d{14}$/, {
    message:
      'CNPJ inválido: Formato esperado XX.XXX.XXX/XXXX-XX ou XXXXXXXXXXXXXX',
  })
  .refine(
    cnpj => {
      // Remove caracteres não numéricos
      cnpj = cnpj.replace(/\D/g, '')

      // Verifica se tem 14 dígitos
      if (cnpj.length !== 14) return false

      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1+$/.test(cnpj)) return false

      // Validação do primeiro dígito verificador
      let soma = 0
      let peso = 5
      for (let i = 0; i < 12; i++) {
        soma += Number.parseInt(cnpj.charAt(i)) * peso
        peso = peso === 2 ? 9 : peso - 1
      }
      let resto = soma % 11
      const dv1 = resto < 2 ? 0 : 11 - resto

      // Validação do segundo dígito verificador
      soma = 0
      peso = 6
      for (let i = 0; i < 13; i++) {
        soma += Number.parseInt(cnpj.charAt(i)) * peso
        peso = peso === 2 ? 9 : peso - 1
      }
      resto = soma % 11
      const dv2 = resto < 2 ? 0 : 11 - resto

      // Verifica se os dígitos verificadores estão corretos
      return (
        Number.parseInt(cnpj.charAt(12)) === dv1 &&
        Number.parseInt(cnpj.charAt(13)) === dv2
      )
    },
    {
      message:
        'CNPJ inválido: O número não passou na validação de dígitos verificadores.',
    }
  )

export class CNPJ {
  private readonly cnpj: string

  private constructor(cnpj: string) {
    this.validate(cnpj)
    this.cnpj = cnpj
  }

  private validate(cnpj: string) {
    const { error } = CNPJSchema.safeParse(cnpj)

    if (error) {
      throw new NotificationError({
        message: error.message,
        code: HttpCode.FORBIDDEN,
      })
    }
  }

  static create(cnpj: string) {
    return new CNPJ(cnpj)
  }

  value() {
    return this.cnpj.replace(/\D/g, '')
  }

  formated() {
    return this.cnpj
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }
}
