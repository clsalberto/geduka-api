import { eq } from 'drizzle-orm'

import { User, type UserEntity } from '~/domain/entities'
import { Email, Phone } from '~/domain/types'

import type { MemberProps, UsersGateway } from '~/application/gateways'

import type { Transaction } from '~/infrastructure/drizzle/client'
import { members } from '~/infrastructure/drizzle/schema/members'
import { users } from '~/infrastructure/drizzle/schema/users'

export class UsersRepository implements UsersGateway {
  constructor(private readonly ctx: Transaction) {}

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.ctx.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (data === undefined) return null

    return User.instance(
      {
        ...data,
        email: Email.create(data.email),
        phone: Phone.create(data.phone),
      },
      data.id
    )
  }

  async findByPhone(phone: string): Promise<User | null> {
    const data = await this.ctx.query.users.findFirst({
      where: eq(users.phone, phone),
    })

    if (data === undefined) return null

    return User.instance(
      {
        ...data,
        email: Email.create(data.email),
        phone: Phone.create(data.phone),
      },
      data.id
    )
  }

  async insert(user: UserEntity, member: MemberProps): Promise<void> {
    await this.ctx.transaction(async tx => {
      const [data] = await tx
        .insert(users)
        .values({ ...user })
        .returning()

      await tx.insert(members).values({
        userId: data.id,
        tenantId: member.tenantId,
        role: member.role,
      })
    })
  }
}
