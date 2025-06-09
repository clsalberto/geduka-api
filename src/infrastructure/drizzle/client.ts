import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import { type PostgresJsQueryResultHKT, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { addresses } from '~/infrastructure/drizzle/schema/addresses'
import {
  members,
  membersRelations,
} from '~/infrastructure/drizzle/schema/members'
import {
  tenants,
  tenantsRelations,
} from '~/infrastructure/drizzle/schema/tenants'
import { users, usersRelations } from '~/infrastructure/drizzle/schema/users'

import { env } from '~/infrastructure/env'

const pg = postgres(env.POSTGRES_URL)

const schema = {
  addresses,
  tenants,
  tenantsRelations,
  members,
  membersRelations,
  users,
  usersRelations,
}

export const db = drizzle(pg, { schema, logger: true })

export type Transaction =
  | typeof db
  | PgTransaction<
      PostgresJsQueryResultHKT,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >
