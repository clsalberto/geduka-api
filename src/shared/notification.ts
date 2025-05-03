import { HttpCode } from '~/shared/http'

export class NotificationError extends Error {
  code: HttpCode

  constructor(message: string, code?: HttpCode) {
    super(message)
    this.code = code ?? HttpCode.INTERNAL_SERVER_ERROR
  }
}

export class NotificationData<T = unknown> {
  message: string
  code: HttpCode
  data?: T | null

  constructor(message: string, code?: HttpCode, data?: T | null) {
    this.message = message
    this.code = code ?? HttpCode.INTERNAL_SERVER_ERROR
    this.data = data
  }
}
