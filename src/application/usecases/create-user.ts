import { User, UserEntity } from '~/domain/entities'
import { Email, Phone } from '~/domain/types'

import type { HashAdapter } from '~/application/adapters/hash'
import type { UsersGateway } from '~/application/gateways/users'
import type { Usecase } from '~/application/usecase'

import { HttpCode } from '~/shared/http'
import { NotificationData, NotificationError } from '~/shared/notification'
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

export interface CreateUserOutput {
  user: UserEntity
}

export interface CreateUserInterface
  extends Usecase<CreateUserInput, CreateUserOutput> {}

export class CreateUserUsecase implements CreateUserInterface {
  constructor(
    private readonly user: UsersGateway,
    private readonly crypto: HashAdapter
  ) {}

  async execute(
    data: CreateUserInput
  ): Promise<NotificationData<CreateUserOutput>> {
    const userExists = await this.user.findByUniqueProps({
      email: data.email,
      phone: data.phone,
      username: data.username,
    })

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
      { user: user.formated() }
    )
  }
}
