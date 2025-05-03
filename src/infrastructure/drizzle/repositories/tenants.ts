import { eq, or } from 'drizzle-orm'

import { Tenant } from '~/domain/entities'
import { CNPJ, Email, Phone } from '~/domain/types'

import type {
  TenantUniqueProps,
  TenantsGateway,
} from '~/application/gateways/tenants'

import type { Transaction } from '~/infrastructure/drizzle/client'
import { tenants } from '~/infrastructure/drizzle/schema/tenants'

export class TenantsRepository implements TenantsGateway {
  constructor(private readonly ctx: Transaction) {}

  async findByUniqueProps(props: TenantUniqueProps): Promise<Tenant | null> {
    const data = await this.ctx.query.tenants.findFirst({
      where: or(
        eq(tenants.email, props.email),
        eq(tenants.phone, props.phone),
        eq(tenants.taxId, props.taxId)
      ),
    })

    if (!data) return null

    return Tenant.instance(
      {
        ...data,
        email: Email.create(data.email),
        phone: Phone.create(data.phone),
        taxId: CNPJ.create(data.taxId),
      },
      data.id
    )
  }

  async findByEmail(email: string): Promise<Tenant | null> {
    const data = await this.ctx.query.tenants.findFirst({
      where: eq(tenants.email, email),
    })

    if (!data) return null

    return Tenant.instance(
      {
        ...data,
        email: Email.create(data.email),
        phone: Phone.create(data.phone),
        taxId: CNPJ.create(data.taxId),
      },
      data.id
    )
  }

  async findByPhone(phone: string): Promise<Tenant | null> {
    const data = await this.ctx.query.tenants.findFirst({
      where: eq(tenants.phone, phone),
    })

    if (!data) return null

    return Tenant.instance(
      {
        ...data,
        email: Email.create(data.email),
        phone: Phone.create(data.phone),
        taxId: CNPJ.create(data.taxId),
      },
      data.id
    )
  }

  async findByTaxID(taxId: string): Promise<Tenant | null> {
    const data = await this.ctx.query.tenants.findFirst({
      where: eq(tenants.taxId, taxId),
    })

    if (!data) return null

    return Tenant.instance(
      {
        ...data,
        email: Email.create(data.email),
        phone: Phone.create(data.phone),
        taxId: CNPJ.create(data.taxId),
      },
      data.id
    )
  }

  async insert(tenant: Tenant): Promise<void> {
    await this.ctx.insert(tenants).values({
      ...tenant.props,
      email: tenant.props.email.value(),
      phone: tenant.props.phone.value(),
      taxId: tenant.props.taxId.value(),
      id: tenant.id,
    })
  }
}
