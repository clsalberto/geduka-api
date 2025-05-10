import { Tenant } from '~/domain/entities'
import { NotificationData, NotificationError } from '~/domain/notification'
import { CNPJ, Email, Phone } from '~/domain/types'

import type { TenantsGateway } from '~/application/gateways/tenants'
import type { Usecase } from '~/application/usecase'

import type {
  CreateAddressInput,
  CreateAddressInterface,
} from './create-address'
import type { CreateUserInterface } from './create-user'

import { HttpCode } from '~/shared/http'
import { Role } from '~/shared/role'

export interface CreateTenantInput {
  name: string
  email: string
  phone: string
  taxId: string
  domain: string
  password: string
  address: CreateAddressInput
}

export interface CreateTenantInterface
  extends Usecase<CreateTenantInput, NotificationData<Tenant>> {}

export class CreateTenantUsecase implements CreateTenantInterface {
  constructor(
    private readonly tenant: TenantsGateway,
    private readonly address: CreateAddressInterface,
    private readonly user: CreateUserInterface
  ) {}

  async execute(
    data: CreateTenantInput,
    db: unknown
  ): Promise<NotificationData<Tenant>> {
    const tenantExists = await this.tenant.findByUniqueProps({ ...data })

    if (tenantExists)
      throw new NotificationError({
        message: 'Tenant already exists',
        code: HttpCode.CONFLICT,
      })

    const { data: address } = await this.address.execute(
      { ...data.address },
      db
    )

    const tenant = Tenant.instance({
      ...data,
      email: Email.create(data.email),
      phone: Phone.create(data.phone),
      taxId: CNPJ.create(data.taxId),
      addressId: address.id,
    })
    await this.tenant.insert(tenant)

    await this.user.execute(
      {
        ...data,
        username: data.domain,
        tenantId: tenant.id,
        role: Role.TENANT,
      },
      db
    )

    return new NotificationData(
      { message: 'Tenant created successfully', code: HttpCode.CREATED },
      tenant
    )
  }
}
