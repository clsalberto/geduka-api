import { hash } from 'bcrypt'
import { eq } from 'drizzle-orm'

import { db } from '~/database'
import { users } from '~/database/schema'

import { Notify } from '~/shared/notify'

export namespace User {
  export async function create({
    name,
    email,
    phone,
    password,
  }: typeof users.$inferInsert) {
    const userByEmailExists = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (userByEmailExists)
      return { notify: Notify.conflict('User email already exists') }

    const userByPhoneExists = await db.query.users.findFirst({
      where: eq(users.phone, phone),
    })

    if (userByPhoneExists)
      return { notify: Notify.conflict('User phone already exists') }

    const passwordHash = await hash(password, 10)

    const user = await db
      .insert(users)
      .values([
        {
          name,
          email,
          phone,
          password: passwordHash,
        },
      ])
      .returning()

    return { user: user[0] }
  }
}
