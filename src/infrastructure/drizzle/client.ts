import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import { type PostgresJsQueryResultHKT, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { addresses } from '~/infrastructure/drizzle/schema/addresses'
import { members } from '~/infrastructure/drizzle/schema/members'
import { tenants } from '~/infrastructure/drizzle/schema/tenants'
import { users } from '~/infrastructure/drizzle/schema/users'

import { env } from '~/infrastructure/env'

const pg = postgres(env.POSTGRES_URL)

const schema = {
  addresses,
  tenants,
  members,
  users,
}

export const db = drizzle(pg, { schema, logger: true })

export type Transaction =
  | typeof db
  | PgTransaction<
    PostgresJsQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
  >
