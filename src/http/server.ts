import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from '~/enviroment'
import { errorHandler } from './error'
import { createAccountRoute, getApiInfoRoute } from './routes'

const app = fastify({
  logger:
    env.NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          },
        }
      : false,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(getApiInfoRoute)
app.register(createAccountRoute)

app.setErrorHandler(errorHandler)

app.listen({ port: env.PORT }).then(() => {
  if (env.NODE_ENV === 'production') console.info('Server running...')
})
