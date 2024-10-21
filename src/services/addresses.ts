import { and, eq } from 'drizzle-orm'

import { db } from '~/database'
import { addresses } from '~/database/schema'

export namespace Address {
  export async function load(data: typeof addresses.$inferInsert) {
    const address = await db
      .select()
      .from(addresses)
      .where(
        and(
          eq(addresses.zip, data.zip),
          eq(addresses.place, data.place),
          eq(addresses.number, data.number),
          eq(addresses.complement, data.complement ?? ''),
          eq(addresses.district, data.district)
        )
      )

    if (address.length > 0) return { address: address[0] }

    const newAddress = await db
      .insert(addresses)
      .values([{ ...data }])
      .returning()

    return { address: newAddress[0] }
  }
}
