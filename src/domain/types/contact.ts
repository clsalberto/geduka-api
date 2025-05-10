import type { Email } from './email'
import type { Phone } from './phone'

export interface ContactProps {
  email: Email
  phone: Phone
}

export class Contacts {
  private contacts: ContactProps

  private constructor(contacts: ContactProps) {
    this.contacts = contacts
  }

  static create(contacts: ContactProps) {
    return new Contacts(contacts)
  }

  get phone() {
    return this.contacts.phone
  }

  get email() {
    return this.contacts.email
  }

  value() {
    return this.contacts
  }
}
