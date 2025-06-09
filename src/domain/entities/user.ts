import type { Replace } from '~/domain/replace'

import { Entity } from '../entity'
import type { Email, Phone } from '../types'

export interface TenantMember {
  id: string
  name: string
  email: Email
  phone: Phone
  image?: string | null
}

export interface UserProps {
  image?: string | null
  name: string
  email: Email
  phone: Phone
  password: string
  tenants?: TenantMember[]
  createdAt: Date
  activated: boolean
}

export interface UserEntity
  extends Replace<UserProps, { email: string; phone: string }> {
  id: string
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

  value(): UserEntity {
    return {
      id: this.id,
      name: this.props.name,
      email: this.props.email.value(),
      phone: this.props.phone.value(),
      password: this.props.password,
      image: this.props.image,
      createdAt: this.props.createdAt,
      activated: this.props.activated,
      tenants: this.props.tenants,
    }
  }

  formated(): UserEntity {
    return {
      id: this.id,
      name: this.props.name,
      email: this.props.email.value(),
      phone: this.props.phone.formated(),
      password: '********',
      image: this.props.image,
      createdAt: this.props.createdAt,
      activated: this.props.activated,
      tenants: this.props.tenants,
    }
  }
}
