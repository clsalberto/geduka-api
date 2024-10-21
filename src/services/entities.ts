import { eq } from 'drizzle-orm'

import { db } from '~/database'
import { entities } from '~/database/schema'

import { Notify } from '~/shared/notify'

export namespace Entity {
  export async function create(data: typeof entities.$inferInsert) {
    const entityByEmailExists = await db.query.entities.findFirst({
      where: eq(entities.email, data.email),
    })

    if (entityByEmailExists)
      return { notify: Notify.conflict('Entity email already exists') }

    const entityByPhoneExists = await db.query.entities.findFirst({
      where: eq(entities.phone, data.phone),
    })

    if (entityByPhoneExists)
      return { notify: Notify.conflict('Entity phone already exists') }

    const entityByTaxIdExists = await db.query.entities.findFirst({
      where: eq(entities.taxId, data.taxId),
    })

    if (entityByTaxIdExists)
      return { notify: Notify.conflict('Entity tax id already exists') }

    const newEntity = await db
      .insert(entities)
      .values([{ ...data }])
      .returning()

    return { entity: newEntity[0] }
  }
}
