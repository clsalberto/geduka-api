import { db } from '..'
import { addresses, entities, members, users } from '../schema'

async function reset() {
  await db.delete(members)
  await db.delete(users)
  await db.delete(entities)
  await db.delete(addresses)
}

reset()
