import { Tenant } from '~/domain/entities'
import { CNPJ, Email, Phone } from '~/domain/types'

import type { Usecase } from '~/application/usecase'

import type { TenantsGateway } from '../gateways/tenants'
import type {
  CreateAddressInput,
  CreateAddressInterface,
} from './create-address'
import type { CreateUserInterface } from './create-user'

import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'
import { Role } from '~/shared/role'

export interface CreateTenantInput {
  name: string
  email: string
  phone: string
  taxId: string
  password: string
  address: CreateAddressInput
}

export interface CreateTenantOutput {
  tenant: Tenant
}

export interface CreateTenantInterface
  extends Usecase<CreateTenantInput, CreateTenantOutput> {}

export class CreateTenantUsecase implements CreateTenantInterface {
  constructor(
    private readonly tenant: TenantsGateway,
    private readonly address: CreateAddressInterface,
    private readonly user: CreateUserInterface
  ) {}

  async execute(
    data: CreateTenantInput,
    db: unknown
  ): Promise<CreateTenantOutput> {
    const tenantExists = await this.tenant.findByUniqueProps({ ...data })
    if (tenantExists)
      throw new NotificationError('Tenant already exists', HttpCode.CONFLICT)

    const { address } = await this.address.execute({ ...data.address }, db)

    const tenant = Tenant.instance({
      ...data,
      email: Email.create(data.email),
      phone: Phone.create(data.phone),
      taxId: CNPJ.create(data.taxId),
      addressId: address.id,
    })

    await this.user.execute(
      { ...data, tenantId: tenant.id, role: Role.TENANT },
      db
    )

    return { tenant }
  }
}
