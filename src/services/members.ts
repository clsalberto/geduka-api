import { and, eq } from 'drizzle-orm'

import { db } from '~/database'
import { members } from '~/database/schema'

import { Notify } from '~/shared/notify'

export namespace Member {
  export async function create({
    entityId,
    userId,
    role,
  }: typeof members.$inferInsert) {
    const member = await db.query.members.findFirst({
      where: and(eq(members.entityId, entityId), eq(members.userId, userId)),
    })

    if (member)
      return {
        notify: Notify.conflict('User is already a member of the entity'),
      }

    const newMember = await db
      .insert(members)
      .values([{ entityId, userId, role }])
      .returning()

    return { member: newMember[0] }
  }
}
