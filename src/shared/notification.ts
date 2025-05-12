export interface NotificationProps {
  message: string
  statusCode: number
}

export class NotificationError extends Error {
  statusCode: number

  constructor(props: NotificationProps) {
    super(props.message)
    this.statusCode = props.statusCode
  }
}

export class NotificationData<T> {
  message: string
  statusCode: number
  data: T

  constructor(props: NotificationProps, data: T) {
    this.message = props.message
    this.statusCode = props.statusCode
    this.data = data
  }
}
