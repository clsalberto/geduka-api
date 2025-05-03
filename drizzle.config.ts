import type { Config } from 'drizzle-kit'

import { env } from '~/infrastructure/env'

export default {
  schema: './src/infrastructure/drizzle/schema/*',
  out: './src/infrastructure/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
} satisfies Config
