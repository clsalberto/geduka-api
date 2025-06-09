import type { ValidationResult } from './validation'

export function validateCPF(cpf: string): ValidationResult {
  // Verifica o formato usando regex
  const formatRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$|^\d{11}$/
  if (!formatRegex.test(cpf))
    return {
      error: true,
      message:
        'Invalid tax id (cpf): Expected format XXX.XXX.XXX-XX or XXXXXXXXXXX',
    }

  // Remove caracteres não numéricos
  const cleanCpf = cpf.replace(/\D/g, '')

  // Verifica se tem 14 dígitos
  if (cleanCpf.length !== 11) {
    return {
      error: true,
      message: 'Invalid tax id (cpf): Must contain 11 digits',
    }
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCpf)) {
    return {
      error: true,
      message: 'Invalid tax id (cpf): All digits are the same',
    }
  }

  // Validação do primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += Number.parseInt(cleanCpf.charAt(i)) * (10 - i)
  }
  let resto = soma % 11
  const dv1 = resto < 2 ? 0 : 11 - resto

  // Validação do segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += Number.parseInt(cleanCpf.charAt(i)) * (11 - i)
  }
  resto = soma % 11
  const dv2 = resto < 2 ? 0 : 11 - resto

  // Verifica se os dígitos verificadores estão corretos
  const isValid =
    Number.parseInt(cleanCpf.charAt(9)) === dv1 &&
    Number.parseInt(cleanCpf.charAt(10)) === dv2

  return isValid
    ? { error: false, message: '' }
    : {
        error: true,
        message:
          'Invalid tax id (cpf): The number did not pass the check digit validation',
      }
}
