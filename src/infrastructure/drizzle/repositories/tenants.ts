import { eq } from 'drizzle-orm'

import { Tenant, type TenantEntity } from '~/domain/entities'
import { CNPJ, Email, Phone } from '~/domain/types'

import type { TenantsGateway } from '~/application/gateways'

import type { Transaction } from '~/infrastructure/drizzle/client'
import { tenants } from '~/infrastructure/drizzle/schema/tenants'

export class TenantsRepository implements TenantsGateway {
  constructor(private readonly ctx: Transaction) {}

  async findByEmail(email: string): Promise<Tenant | null> {
    const data = await this.ctx.query.tenants.findFirst({
      where: eq(tenants.email, email),
    })

    if (data === undefined) return null

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

    if (data === undefined) return null

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

  async findByTaxId(taxId: string): Promise<Tenant | null> {
    const data = await this.ctx.query.tenants.findFirst({
      where: eq(tenants.taxId, taxId),
    })

    if (data === undefined) return null

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

  async insert(tenant: TenantEntity): Promise<void> {
    await this.ctx.insert(tenants).values({ ...tenant })
  }
}
