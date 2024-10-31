import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function getApiInfoRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/', async ({ protocol, hostname, port }) => {
      return {
        name: 'Geduka API',
        host: `${protocol}://${hostname}:${port}/api`,
        version: '1.0.0',
      }
    })
}
