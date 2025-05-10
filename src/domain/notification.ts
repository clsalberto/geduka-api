import type { HttpCode } from '~/shared/http'

export interface NotificationProps {
  message: string
  code: HttpCode
}

export class NotificationError extends Error {
  code: HttpCode

  constructor(props: NotificationProps) {
    super(props.message)
    this.code = props.code
  }
}

export class NotificationData<T> {
  message: string
  code: HttpCode
  data: T

  constructor(props: NotificationProps, data: T) {
    this.message = props.message
    this.code = props.code
    this.data = data
  }
}
