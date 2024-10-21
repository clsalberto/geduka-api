import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { env } from '../enviroment'
import * as schema from './schema'

const pool = new Pool({ connectionString: env.DATABASE_URL })

const db = drizzle(pool, {
  schema,
  logger: env.NODE_ENV === 'development',
})

export { schema, db }
