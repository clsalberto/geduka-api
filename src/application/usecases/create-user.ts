import { User } from '~/domain/entities'
import { NotificationData, NotificationError } from '~/domain/notification'
import { Email, Phone } from '~/domain/types'

import type { HashAdapter } from '~/application/adapters/hash'
import type { UsersGateway } from '~/application/gateways/users'
import type { Usecase } from '~/application/usecase'

import { HttpCode } from '~/shared/http'
import type { Role } from '~/shared/role'

export interface CreateUserInput {
  name: string
  email: string
  username: string
  phone: string
  password: string
  tenantId: string
  role: Role
}

export interface CreateUserInterface
  extends Usecase<CreateUserInput, NotificationData<User>> {}

export class CreateAccountUsecase implements CreateUserInterface {
  constructor(
    private readonly user: UsersGateway,
    private readonly crypto: HashAdapter
  ) {}

  async execute(data: CreateUserInput): Promise<NotificationData<User>> {
    const userExists = await this.user.findByUniqueProps({ ...data })

    if (userExists)
      throw new NotificationError({
        message: 'User already exists',
        code: HttpCode.CONFLICT,
      })

    const passwordHash = await this.crypto.hash(data.password)

    const user = User.instance({
      ...data,
      email: Email.create(data.email),
      phone: Phone.create(data.phone),
      password: passwordHash,
    })

    await this.user.insert(user, { tenantId: data.tenantId, role: data.role })

    return new NotificationData(
      { message: 'User created successfully', code: HttpCode.CREATED },
      user
    )
  }
}
