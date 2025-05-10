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
          phone: z.string(),
          taxId: z.string(),
          password: z.string(),
          domain: z.string(),
          address: z.object({
            zip: z.string(),
            place: z.string(),
            number: z.string(),
            complement: z.string().nullish(),
            district: z.string(),
            city: z.string(),
            state: z.string(),
          }),
        }),
      },
    },
    (request, reply) => {
      const { name, email, phone, taxId, password, domain, address } =
        request.body

      return reply
        .status(201)
        .send({ name, email, phone, taxId, password, domain, address })
    }
  )
}
