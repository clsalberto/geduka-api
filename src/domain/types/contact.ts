import type { Email } from './email'
import type { Phone } from './phone'

export interface ContactProps {
  email: Email
  phone: Phone
}

export class Contacts {
  private contact: ContactProps

  private constructor(contact: ContactProps) {
    this.contact = contact
  }

  static create(contact: ContactProps) {
    return new Contacts(contact)
  }

  get phone() {
    return this.contact.phone
  }

  get email() {
    return this.contact.email
  }
}
