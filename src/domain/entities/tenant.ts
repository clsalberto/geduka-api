import { Entity } from '../entity'
import type { Replace } from '../replace'
import type { CNPJ, Email, Phone } from '../types'

export interface TenantProps {
  name: string
  email: Email
  phone: Phone
  taxId: CNPJ
  addressId: string
  createdAt: Date
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
}
