import type { ValidationResult } from './validation'

export function validateZip(zip: string): ValidationResult {
  // Verifica o formato básico (XXXXX-XXX ou XXXXXXXX)
  if (!/^\d{5}-\d{3}$|^\d{8}$/.test(zip)) {
    return {
      error: true,
      message: 'Invalid ZIP code: Expected format XXXXX-XXX or XXXXXXXX',
    }
  }

  // Remove caracteres não numéricos
  const numeros = zip.replace(/\D/g, '')

  // Verifica se tem 8 dígitos
  if (numeros.length !== 8) {
    return {
      error: true,
      message: 'Invalid ZIP code: Must contain 8 digits',
    }
  }

  // Verifica se não são todos os dígitos iguais (ex: 00000-000)
  if (/^(\d)\1+$/.test(numeros)) {
    return {
      error: true,
      message: 'Invalid ZIP code: Cannot have all the same digits',
    }
  }

  return { error: false, message: '' }
}
