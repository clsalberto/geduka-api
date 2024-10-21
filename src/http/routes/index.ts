import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createAccountRoute } from './create-account'

export const getApiRoutes: FastifyPluginAsyncZod = async app => {
  app.get('/', async ({ hostname }) => {
    return { message: `Hello World ${hostname}` }
  })

  app.register(createAccountRoute)
}
