import type { FastifyInstance } from 'fastify'

import { createNewAccountHandler } from './create-new-account'

export async function routes(app: FastifyInstance) {
  app.post('/accounts', createNewAccountHandler)
}
