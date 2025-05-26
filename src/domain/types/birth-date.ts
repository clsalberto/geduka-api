import { z } from 'zod'
import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export const BirthDateSchema = z.coerce
  .date({
    message:
      'Data de nascimento inválida: Formatos esperados DD/MM/AAAA ou AAAA-MM-DD',
  })
  .refine(
    date => {
      // Verifica se é uma data válida
      if (Number.isNaN(date.getTime())) return false

      // Extrai componentes da data
      const ano = date.getFullYear()
      const mes = date.getMonth() + 1 // getMonth() retorna 0-11
      const dia = date.getDate()

      // Verifica se o dia é válido para o mês
      const diasNoMes = new Date(ano, mes, 0).getDate()
      if (dia < 1 || dia > diasNoMes) return false

      // Verifica se não é uma data futura
      const hoje = new Date()
      if (date > hoje) return false

      // Verifica se a idade está dentro de limites razoáveis (0-120 anos)
      const idadeMaxima = 120
      const dataMinima = new Date()
      dataMinima.setFullYear(hoje.getFullYear() - idadeMaxima)
      if (date < dataMinima) return false

      return true
    },
    {
      message:
        'Data de nascimento inválida: Deve ser uma data real, não futura e dentro de limites razoáveis de idade (0-120 anos).',
    }
  )

export class BirthDate {
  private readonly birthDate: Date

  private constructor(birthDate: Date) {
    this.validate(birthDate)
    this.birthDate = birthDate
  }

  private validate(birthDate: Date) {
    const { error } = BirthDateSchema.safeParse(birthDate)

    if (error) {
      throw new NotificationError({
        message: error.message,
        code: HttpCode.FORBIDDEN,
      })
    }
  }

  value() {
    return this.birthDate
  }
}
