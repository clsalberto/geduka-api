import { User } from '~/domain/entities'
import { NotificationError } from '~/domain/notification'
import { Email, Phone } from '~/domain/types'

import type { HashAdapter } from '~/application/adapters/hash'
import type { UsersGateway } from '~/application/gateways/users'
import type { Usecase } from '~/application/usecase'

import { HttpCode } from '~/shared/http'
import type { Role } from '~/shared/role'

export interface CreateUserInput {
  name: string
  email: string
  phone: string
  password: string
  tenantId: string
  role: Role
}

export interface CreateAccountOutput {
  user: User
}

export interface CreateUserInterface
  extends Usecase<CreateUserInput, CreateAccountOutput> {}

export class CreateAccountUsecase implements CreateUserInterface {
  constructor(
    private readonly user: UsersGateway,
    private readonly crypto: HashAdapter
  ) {}

  async execute(
    data: CreateUserInput,
    db: unknown
  ): Promise<CreateAccountOutput> {
    const userExists = await this.user.findByContactProps({ ...data })
    if (userExists)
      throw new NotificationError('User already exists', HttpCode.CONFLICT)

    const passwordHash = await this.crypto.hash(data.password)

    const user = User.instance({
      ...data,
      email: Email.create(data.email),
      phone: Phone.create(data.phone),
      password: passwordHash,
    })

    await this.user.insert(user, { ...data })

    return { user }
  }
}
