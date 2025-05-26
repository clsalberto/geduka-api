import { z } from 'zod'

import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export const CPFSchema = z
  .string()
  .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$|^\d{11}$/, {
    message: 'CPF inválido: Formato esperado XXX.XXX.XXX-XX ou XXXXXXXXXXX',
  })
  .refine(
    cpf => {
      // Remove caracteres não numéricos
      cpf = cpf.replace(/\D/g, '')

      // Verifica se tem 11 dígitos
      if (cpf.length !== 11) return false

      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1+$/.test(cpf)) return false

      // Validação do primeiro dígito verificador
      let soma = 0
      for (let i = 0; i < 9; i++) {
        soma += Number.parseInt(cpf.charAt(i)) * (10 - i)
      }
      let resto = soma % 11
      const dv1 = resto < 2 ? 0 : 11 - resto

      // Validação do segundo dígito verificador
      soma = 0
      for (let i = 0; i < 10; i++) {
        soma += Number.parseInt(cpf.charAt(i)) * (11 - i)
      }
      resto = soma % 11
      const dv2 = resto < 2 ? 0 : 11 - resto

      // Verifica se os dígitos verificadores estão corretos
      return (
        Number.parseInt(cpf.charAt(9)) === dv1 &&
        Number.parseInt(cpf.charAt(10)) === dv2
      )
    },
    {
      message:
        'CPF inválido: O número não passou na validação de dígitos verificadores.',
    }
  )

export class CPF {
  private readonly cpf: string

  private constructor(cpf: string) {
    this.validate(cpf)
    this.cpf = cpf
  }

  private validate(cpf: string) {
    const { error } = CPFSchema.safeParse(cpf)

    if (error) {
      throw new NotificationError({
        message: error.message,
        code: HttpCode.FORBIDDEN,
      })
    }
  }

  static create(cpf: string) {
    return new CPF(cpf)
  }

  value() {
    return this.cpf.replace(/\D/g, '')
  }

  formated() {
    return this.cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }
}
