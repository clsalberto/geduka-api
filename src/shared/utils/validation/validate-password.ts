import type { ValidationResult } from './validation'

export function validatePassword(password: string): ValidationResult {
  if (password.length < 8)
    return {
      error: true,
      message: 'Password must be at least 8 characters long',
    }

  if (!/[A-Z]/.test(password))
    return {
      error: true,
      message: 'Password should contain at least 1 uppercase character',
    }

  if (!/[a-z]/.test(password))
    return {
      error: true,
      message: 'Password should contain at least 1 lowercase character',
    }

  if (!/[0-9]/.test(password))
    return {
      error: true,
      message: 'Password must contain at least one number',
    }

  if (!/[^A-Za-z0-9]/.test(password))
    return {
      error: true,
      message: 'Password must contain at least one special character',
    }

  return {
    error: false,
    message: '',
  }
}
