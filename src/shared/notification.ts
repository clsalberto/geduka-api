import type { HttpCode } from './http'

export class Notification {
  message: string
  code: HttpCode
  data?: unknown

  constructor(message: string, code: HttpCode, data?: unknown) {
    this.message = message
    this.code = code
    this.data = data
  }
}

export class NotificationError extends Error {
  code: HttpCode
  data?: unknown

  constructor(message: string, code: HttpCode, data?: unknown) {
    super(message)
    this.code = code
    this.data = data
  }
}
