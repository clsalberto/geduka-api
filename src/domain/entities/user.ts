import type { Replace } from '~/domain/replace'

import { Entity } from '../entity'
import type { Email, Phone } from '../types'

export interface UserProps {
  name: string
  email: Email
  phone: Phone
  password: string
  createdAt: Date
  activated: boolean
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id)
  }

  static instance(
    props: Replace<UserProps, { createdAt?: Date; activated?: boolean }>,
    id?: string
  ) {
    return new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        activated: props.activated ?? false,
      },
      id
    )
  }
}
