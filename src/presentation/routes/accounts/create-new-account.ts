import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import {
  CreateAddressUsecase,
  CreateTenantUsecase,
  CreateUserUsecase,
} from '~/application/usecases'

import { db } from '~/infrastructure/drizzle/client'
import {
  TenantsRepository,
  UsersRepository,
  AddressesRepository,
} from '~/infrastructure/drizzle/repositories'
import { BcryptHashProvider } from '~/infrastructure/providers'

import { HttpCode } from '~/shared/http'

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
    async (request, reply) => {
      const { name, email, phone, taxId, password, domain, address } =
        request.body

      await db.transaction(async tx => {
        const tenantsRepository = new TenantsRepository(tx)
        const addressesRepository = new AddressesRepository(tx)
        const usersRepository = new UsersRepository(tx)

        const bcryptHashProvider = new BcryptHashProvider()

        const createAddressUsecase = new CreateAddressUsecase(
          addressesRepository
        )
        const createUserUsecase = new CreateUserUsecase(
          usersRepository,
          bcryptHashProvider
        )
        const createTenantUsecase = new CreateTenantUsecase(
          tenantsRepository,
          createAddressUsecase,
          createUserUsecase
        )

        const { message, code, data } = await createTenantUsecase.execute(
          { name, email, phone, taxId, password, domain, address },
          tx
        )

        return reply.status(code).send({ message, data })
      })

      return reply
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .send({ message: 'Tenant created failed' })
    }
  )
}
