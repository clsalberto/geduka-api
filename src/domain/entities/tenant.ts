import { Entity } from '../entity'
import type { Replace } from '../replace'
import type { CNPJ, Email, Phone } from '../types'

export interface TenantProps {
  name: string
  email: Email
  phone: Phone
  taxId: CNPJ
  domain: string
  users?: string[]
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
      ...this.props,
      email: this.props.email.value(),
      phone: this.props.phone.value(),
      taxId: this.props.taxId.value(),
    }
  }

  formated(): TenantEntity {
    return {
      id: this.id,
      ...this.props,
      email: this.props.email.value(),
      phone: this.props.phone.formated(),
      taxId: this.props.taxId.formated(),
    }
  }
}
