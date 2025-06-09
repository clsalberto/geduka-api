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
    db?: unknown
  ): Promise<NotificationData<CreateTenantOutput>> {
    const tenantEmailExists = await this.tenant.findByEmail(data.email)

    if (tenantEmailExists)
      throw new NotificationError({
        message: 'Tenant email already exists',
        code: HttpCode.CONFLICT,
      })

    const tenantPhoneExists = await this.tenant.findByPhone(data.phone)

    if (tenantPhoneExists)
      throw new NotificationError({
        message: 'Tenant phone already exists',
        code: HttpCode.CONFLICT,
      })

    const tenantTaxIdExists = await this.tenant.findByTaxId(data.taxId)

    if (tenantTaxIdExists)
      throw new NotificationError({
        message: 'Tenant tax id already exists',
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

    await this.tenant.insert(tenant.value())

    const {
      data: { user },
    } = await this.user.execute(
      {
        ...data,
        tenantId: tenant.id,
        role: Role.TENANT,
      },
      db
    )

    tenant.props.users?.push({
      id: user.id,
      name: user.name,
      email: Email.create(user.email),
      phone: Phone.create(user.phone),
      role: Role.TENANT,
      image: user.image,
    })

    return new NotificationData(
      { message: 'Tenant created successfully', code: HttpCode.CREATED },
      { tenant: tenant.formated() }
    )
  }
}
