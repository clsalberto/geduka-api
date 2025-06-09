import type { ValidationResult } from './validation'

export function validateCNPJ(cnpj: string): ValidationResult {
  // Verifica o formato usando regex
  const formatRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$|^\d{14}$/
  if (!formatRegex.test(cnpj)) {
    return {
      error: true,
      message:
        'Invalid tax id (cnpj): Expected format XX.XXX.XXX/XXXX-XX or XXXXXXXXXXXXXX',
    }
  }

  // Remove caracteres não numéricos
  const cleanCnpj = cnpj.replace(/\D/g, '')

  // Verifica se tem 14 dígitos
  if (cleanCnpj.length !== 14) {
    return {
      error: true,
      message: 'Invalid tax id (cnpj): Must contain 14 digits',
    }
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCnpj)) {
    return {
      error: true,
      message: 'Invalid tax id (cnpj): All digits are the same',
    }
  }

  // Validação do primeiro dígito verificador
  let soma = 0
  let peso = 5
  for (let i = 0; i < 12; i++) {
    soma += Number.parseInt(cleanCnpj.charAt(i)) * peso
    peso = peso === 2 ? 9 : peso - 1
  }
  let resto = soma % 11
  const dv1 = resto < 2 ? 0 : 11 - resto

  // Validação do segundo dígito verificador
  soma = 0
  peso = 6
  for (let i = 0; i < 13; i++) {
    soma += Number.parseInt(cleanCnpj.charAt(i)) * peso
    peso = peso === 2 ? 9 : peso - 1
  }
  resto = soma % 11
  const dv2 = resto < 2 ? 0 : 11 - resto

  // Verifica se os dígitos verificadores estão corretos
  const isValid =
    Number.parseInt(cleanCnpj.charAt(12)) === dv1 &&
    Number.parseInt(cleanCnpj.charAt(13)) === dv2

  return isValid
    ? { error: false, message: '' }
    : {
        error: true,
        message:
          'Invalid tax id (cnpj): The number did not pass the check digit validation',
      }
}
