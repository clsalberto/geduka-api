import { Tenant, type TenantEntity } from '~/domain/entities'
import { CNPJ, Email, Phone } from '~/domain/types'

import type { TenantsGateway } from '~/application/gateways/tenants'
import type { Usecase } from '~/application/usecase'

import type {
  CreateAddressInput,
  CreateAddressInterface,
} from './create-address'
import type { CreateUserInterface } from './create-user'

import { HttpCode } from '~/shared/http'
import { NotificationData, NotificationError } from '~/shared/notification'
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

export interface CreateTenantOutput {
  tenant: TenantEntity
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
  ): Promise<NotificationData<CreateTenantOutput>> {
    const tenantExists = await this.tenant.findByUniqueProps({
      email: data.email,
      phone: data.phone,
      taxId: data.taxId,
      domain: data.domain,
    })

    if (tenantExists)
      throw new NotificationError({
        message: 'Tenant already exists',
        code: HttpCode.CONFLICT,
      })

    const {
      data: { address },
    } = await this.address.execute({ ...data.address }, db)

    const tenant = Tenant.instance({
      ...data,
      email: Email.create(data.email),
      phone: Phone.create(data.phone),
      taxId: CNPJ.create(data.taxId),
      addressId: address.id,
    })
    await this.tenant.insert(tenant)

    const {
      data: { user },
    } = await this.user.execute(
      {
        ...data,
        username: data.domain,
        tenantId: tenant.id,
        role: Role.TENANT,
      },
      db
    )

    tenant.props.users?.push({
      id: user.id,
      name: user.name,
      role: Role.TENANT,
    })

    return new NotificationData(
      { message: 'Tenant created successfully', code: HttpCode.CREATED },
      { tenant: tenant.formated() }
    )
  }
}
