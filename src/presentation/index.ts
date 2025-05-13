import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import pino from 'pino'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from '~/infrastructure/env'

import { routes as accounts } from './routes/accounts'

const loggerConfig = {
  redact: [
    'ACCESS_TOKEN_SECRET_KEY',
    'REFRESH_TOKEN_SECRET_KEY',
    'POSTGRES_URL',
    'REDIS_URL',
  ],
  level: 'debug',
  transport: {
    target: 'pino-pretty',
  },
}

export const logger = pino(loggerConfig)

export async function buildServer() {
  const app = fastify({
    logger: loggerConfig,
  }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(fastifyCors, {
    origin: env.FRONTEND_URL,
  })

  const v1 = '/v1/api'
  app.register(accounts, { prefix: v1 })

  return app
}
