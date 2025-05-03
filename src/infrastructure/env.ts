import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  ACCESS_TOKEN_SECRET_KEY: z
    .string()
    .default('d52c17a94c2e5dadac316eaede040547215b02b3'),
  REFRESH_TOKEN_SECRET_KEY: z
    .string()
    .default('c4dcee5f921e75708b90e163989276c57df7ac01'),

  EXPIRED_ACCESS_TOKEN: z.string().default('30s'),
  EXPIRED_REFRESH_TOKEN: z.string().default('1h'),

  POSTGRES_URL: z
    .string()
    .url()
    .default('postgresql://geduka:secret@localhost:5432/geduka_database'),
  REDIS_URL: z.string().url().default('redis://:secret@localhost:6380'),

  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  BACKEND_URL: z.string().url().default('http://localhost:3333'),
})

export const env = envSchema.parse(process.env)
