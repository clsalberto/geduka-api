import { z } from 'zod'
import zennv from 'zennv'

export const env = zennv({
  dotenv: true,
  schema: z.object({
    HOST: z.string().default('0.0.0.0'),
    PORT: z.coerce.number().default(3333),
    NODE_ENV: z.enum(['development', 'production']).default('development'),

    FRONTEND_URL: z.string().url(),
    BACKEND_URL: z.string().url(),

    ACCESS_TOKEN_SECRET_KEY: z.string(),
    REFRESH_TOKEN_SECRET_KEY: z.string(),

    EXPIRED_ACCESS_TOKEN: z.string(),
    EXPIRED_REFRESH_TOKEN: z.string(),

    POSTGRES_URL: z.string().url(),
    REDIS_URL: z.string().url(),
  }),
})
