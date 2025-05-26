import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import { ZodError } from 'zod'

import { NotificationError } from '~/shared/notification'

export const errorHandler: FastifyInstance['errorHandler'] = (
  error: FastifyError | NotificationError | ZodError,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  console.log(error)

  if (error instanceof NotificationError) {
    return reply.status(error.code).send({ message: error.message })
  }

  if (error instanceof ZodError) {
    error.name
  }

  return reply.status(error.statusCode ?? 500).send({ message: error.message })
}
