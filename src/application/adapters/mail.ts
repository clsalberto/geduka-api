export interface MailProps {
  name: string
  email: string
}

export interface MessageProps {
  from: MailProps
  subject: string
  body: string
}

export interface MailAdapter {
  send(message: MessageProps): Promise<void>
}
