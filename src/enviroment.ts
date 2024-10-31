import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  BACKEND_URL: z.string().url().default('http://localhost:3333'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
