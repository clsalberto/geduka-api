import type { ValidationResult } from './validation'

export function validateEmail(email: string): ValidationResult {
  // Basic email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!emailRegex.test(email)) {
    return {
      error: true,
      message: 'Email is invalid',
    }
  }

  return {
    error: false,
    message: '',
  }
}
