import type { Replace } from '~/domain/replace'

import { Entity } from '../entity'
import type { Email, Phone } from '../types'
import type { Role } from '~/shared/role'

export interface Member {
  id: string
  name: string
  role: Role
}

export interface UserProps {
  name: string
  email: Email
  username: string
  phone: Phone
  password: string
  tenants?: Member[]
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
