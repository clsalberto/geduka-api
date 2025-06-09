import type { ValidationResult } from './validation'

export function validatePhone(phone: string): ValidationResult {
  // Verifica o formato básico usando regex
  const formatRegex =
    /^(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/
  if (!formatRegex.test(phone)) {
    return {
      error: true,
      message: 'Invalid Phone: Expected format (XX) 9XXXX-XXXX or XX9XXXXXXXX',
    }
  }

  // Remove caracteres não numéricos
  const numeros = phone.replace(/\D/g, '')

  // Verifica se tem entre 10 e 11 dígitos (com DDD)
  if (numeros.length < 10 || numeros.length > 11) {
    return {
      error: true,
      message: 'Invalid Phone: Must be between 10 and 11 digits',
    }
  }

  // Se tiver 11 dígitos, o primeiro dígito após o DDD deve ser 9 (celular)
  if (numeros.length === 11 && numeros.charAt(2) !== '9') {
    return {
      error: true,
      message:
        'Invalid Phone: Cell phone must start with 9 after the area code',
    }
  }

  // Verifica DDD válido (entre 11 e 99)
  const ddd = Number.parseInt(numeros.substring(0, 2))
  if (ddd < 11 || ddd > 99) {
    return {
      error: true,
      message: 'Invalid Phone: Invalid area code',
    }
  }

  return {
    error: false,
    message: '',
  }
}
