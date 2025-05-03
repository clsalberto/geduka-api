import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createNewAccountRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/accounts',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
      },
    },
    (request, reply) => {
      const { name, email } = request.body

      return reply.status(201).send({ name, email })
    }
  )
}
