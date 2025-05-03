import { eq, or } from 'drizzle-orm'

import { User } from '~/domain/entities'
import { Email, Phone } from '~/domain/types'

import type {
  ContactProps,
  MemberProps,
  UsersGateway,
} from '~/application/gateways/users'

import type { Transaction } from '~/infrastructure/drizzle/client'
import { members } from '~/infrastructure/drizzle/schema/members'
import { users } from '~/infrastructure/drizzle/schema/users'

export class UsersRepository implements UsersGateway {
  constructor(private readonly ctx: Transaction) {}

  async findByContactProps(contact: ContactProps): Promise<User | null> {
    const data = await this.ctx.query.users.findFirst({
      where: or(eq(users.email, contact.email), eq(users.phone, contact.phone)),
    })

    if (!data) return null

    return User.instance(
      {
        ...data,
        email: Email.create(data.email),
        phone: Phone.create(data.phone),
      },
      data.id
    )
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.ctx.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!data) return null

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

    if (!data) return null

    return User.instance(
      {
        ...data,
        email: Email.create(data.email),
        phone: Phone.create(data.phone),
      },
      data.id
    )
  }

  async insert(user: User, member: MemberProps): Promise<void> {
    await this.ctx.transaction(async tx => {
      const [data] = await tx
        .insert(users)
        .values({
          ...user.props,
          email: user.props.email.value(),
          phone: user.props.phone.value(),
          id: user.id,
        })
        .returning()

      await tx.insert(members).values({
        userId: data.id,
        tenantId: member.tenantId,
        role: member.role,
      })
    })
  }
}
