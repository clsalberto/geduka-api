import type { Tenant } from '~/domain/entities'

export interface TenantUniqueProps {
  email: string
  phone: string
  taxId: string
  domain: string
}

export interface TenantsGateway {
  findByUniqueProps(props: TenantUniqueProps): Promise<Tenant | null>
  findByEmail(email: string): Promise<Tenant | null>
  findByPhone(phone: string): Promise<Tenant | null>
  findByTaxID(taxId: string): Promise<Tenant | null>
  insert(tenant: Tenant): Promise<void>
}
