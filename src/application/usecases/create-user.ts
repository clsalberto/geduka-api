import { User, type UserEntity } from '~/domain/entities'
import { Email, Phone } from '~/domain/types'

import type { HashAdapter } from '~/application/adapters'
import type { UsersGateway } from '~/application/gateways'
import type { Usecase } from '~/application/usecase'

import { HttpCode } from '~/shared/http'
import { NotificationData, NotificationError } from '~/shared/notification'
import type { Role } from '~/shared/role'
import { validatePassword } from '~/shared/utils/validation'

export interface CreateUserInput {
  name: string
  email: string
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
    const userEmailExists = await this.user.findByEmail(data.email)

    if (userEmailExists)
      throw new NotificationError({
        message: 'User email already exists',
        code: HttpCode.CONFLICT,
      })

    const userPhoneExists = await this.user.findByPhone(data.phone)

    if (userPhoneExists)
      throw new NotificationError({
        message: 'User phone already exists',
        code: HttpCode.CONFLICT,
      })

    const { error, message } = validatePassword(data.password)

    if (error)
      throw new NotificationError({
        message,
        code: HttpCode.FORBIDDEN,
      })

    const passwordHash = await this.crypto.hash(data.password)

    const user = User.instance({
      ...data,
      email: Email.create(data.email),
      phone: Phone.create(data.phone),
      password: passwordHash,
    })

    await this.user.insert(user.value(), {
      tenantId: data.tenantId,
      role: data.role,
    })

    return new NotificationData(
      { message: 'User created successfully', code: HttpCode.CREATED },
      { user: user.formated() }
    )
  }
}
