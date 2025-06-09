import type { Role } from '~/shared/role'
import { Entity } from '../entity'
import type { Replace } from '../replace'
import type { CNPJ, Email, Phone } from '../types'

export interface UserMember {
  id: string
  name: string
  email: Email
  phone: Phone
  image?: string | null
  role: Role
}

export interface TenantProps {
  image?: string | null
  name: string
  email: Email
  phone: Phone
  taxId: CNPJ
  users?: UserMember[]
  addressId: string
  createdAt: Date
}

export interface TenantEntity
  extends Replace<
    TenantProps,
    { email: string; phone: string; taxId: string }
  > {
  id: string
}

export class Tenant extends Entity<TenantProps> {
  private constructor(props: TenantProps, id?: string) {
    super(props, id)
  }

  static instance(
    props: Replace<TenantProps, { createdAt?: Date }>,
    id?: string
  ) {
    return new Tenant(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id
    )
  }

  value(): TenantEntity {
    return {
      id: this.id,
      name: this.props.name,
      email: this.props.email.value(),
      phone: this.props.phone.value(),
      taxId: this.props.taxId.value(),
      image: this.props.image,
      addressId: this.props.addressId,
      createdAt: this.props.createdAt,
      users: this.props.users,
    }
  }

  formated(): TenantEntity {
    return {
      id: this.id,
      name: this.props.name,
      email: this.props.email.value(),
      phone: this.props.phone.formated(),
      taxId: this.props.taxId.formated(),
      image: this.props.image,
      addressId: this.props.addressId,
      createdAt: this.props.createdAt,
      users: this.props.users,
    }
  }
}
