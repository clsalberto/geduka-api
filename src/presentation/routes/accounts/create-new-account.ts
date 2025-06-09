import type { FastifyReply, FastifyRequest } from 'fastify'

import { db } from '~/infrastructure/drizzle/client'

import {
  type CreateTenantBody,
  createTenantBodySchema,
  createTenantFactory,
} from '~/presentation/factories'

import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

export async function createNewAccountHandler(
  request: FastifyRequest<{ Body: CreateTenantBody }>,
  reply: FastifyReply
) {
  const { error, data: body } = createTenantBodySchema.safeParse(request.body)

  if (error)
    throw new NotificationError({
      message: error.errors[0].message,
      code: HttpCode.BAD_REQUEST,
    })

  const { name, email, phone, taxId, password, address } = body

  await db.transaction(async tx => {
    const factory = createTenantFactory(tx)

    const { code, message, data } = await factory.execute(
      { name, email, phone, taxId, password, address },
      tx
    )

    return reply.status(code).send({ message, data })
  })
}
