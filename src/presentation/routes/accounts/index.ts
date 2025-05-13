import type { FastifyInstance } from 'fastify'

import { createNewAccountRoute } from './create-new-account'

export async function routes(app: FastifyInstance) {
  app.register(createNewAccountRoute)
}
