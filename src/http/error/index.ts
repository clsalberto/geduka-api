import { DrizzleError } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { HttpCode } from '~/shared/http'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError)
    return reply.status(error.statusCode ?? 400).send({
      message: error.message,
      errors: error.errors,
    })

  if (error instanceof DrizzleError)
    return reply.status(error.statusCode ?? 400).send({
      message: error.message,
    })

  if (error)
    return reply.status(error.statusCode ?? 400).send({
      message: error.message,
    })

  return reply
    .status(HttpCode.INTERNAL_SERVER)
    .send({ message: 'Internal server error' })
}
