import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify'

import { NotificationError } from '~/shared/notification'

export const errorHandler: FastifyInstance['errorHandler'] = (
  error: FastifyError | NotificationError,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof NotificationError) {
    return reply.status(error.code).send({
      message: error.message,
    })
  }

  return reply.status(error.statusCode ?? 500).send({
    message: error.message,
  })
}
