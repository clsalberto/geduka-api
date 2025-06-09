import type { Tenant, TenantEntity } from '~/domain/entities'

export interface TenantsGateway {
  findByEmail(email: string): Promise<Tenant | null>
  findByPhone(phone: string): Promise<Tenant | null>
  findByTaxId(taxId: string): Promise<Tenant | null>
  insert(tenant: TenantEntity): Promise<void>
}
