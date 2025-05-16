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
  if (error instanceof NotificationError) {
    return reply.status(error.code).send({ error })
  }

  if (error instanceof ZodError) {
    return reply.status(422).send({ error })
  }

  return reply.status(error.statusCode ?? 500).send({ error })
}
