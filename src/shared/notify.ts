import { HttpCode } from './http'

export type NotifyMessage = {
  message: string
  code: number
}

export namespace Notify {
  export function success(message: string): NotifyMessage {
    return { message, code: HttpCode.SUCCESS }
  }

  export function created(message: string): NotifyMessage {
    return { message, code: HttpCode.CREATED }
  }

  export function badRequest(message: string): NotifyMessage {
    return { message, code: HttpCode.BAD_REQUEST }
  }

  export function unauthorized(message: string): NotifyMessage {
    return { message, code: HttpCode.UNAUTHORIZED }
  }

  export function paymentRequired(message: string): NotifyMessage {
    return { message, code: HttpCode.BAD_REQUEST }
  }

  export function notFound(message: string): NotifyMessage {
    return { message, code: HttpCode.NOT_FOUND }
  }

  export function conflict(message: string): NotifyMessage {
    return { message, code: HttpCode.CONFLICT }
  }

  export function internalServer(message: string): NotifyMessage {
    return { message, code: HttpCode.CONFLICT }
  }
}
