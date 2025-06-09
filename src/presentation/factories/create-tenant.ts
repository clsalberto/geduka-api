import { z } from 'zod'

import {
  CreateAddressUsecase,
  CreateTenantUsecase,
  CreateUserUsecase,
} from '~/application/usecases'

import type { Transaction } from '~/infrastructure/drizzle/client'
import {
  AddressesRepository,
  TenantsRepository,
  UsersRepository,
} from '~/infrastructure/drizzle/repositories'
import { BcryptHashProvider } from '~/infrastructure/providers'

export const createTenantBodySchema = z.object({
  name: z.string({ message: 'Name is required' }),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Email is invalid' }),
  phone: z.string({ message: 'Phone is required' }),
  taxId: z.string({ message: 'Tax id (cnpj) is required' }),
  password: z.string({ message: 'Password is required' }),
  address: z.object({
    zip: z.string({ message: 'Zip is required' }),
    place: z.string({ message: 'Place is required' }),
    number: z.string({ message: 'Number is required' }),
    complement: z.string().nullish(),
    district: z.string({ message: 'District is required' }),
    city: z.string({ message: 'City is required' }),
    state: z.string({ message: 'State is required' }),
  }),
})

export type CreateTenantBody = z.infer<typeof createTenantBodySchema>

export const createTenantFactory = (db: Transaction) => {
  const tenantsRepository = new TenantsRepository(db)
  const addressesRepository = new AddressesRepository(db)
  const usersRepository = new UsersRepository(db)

  const bcryptHashProvider = new BcryptHashProvider()

  const createAddressUsecase = new CreateAddressUsecase(addressesRepository)
  const createUserUsecase = new CreateUserUsecase(
    usersRepository,
    bcryptHashProvider
  )
  const createTenantUsecase = new CreateTenantUsecase(
    tenantsRepository,
    createAddressUsecase,
    createUserUsecase
  )

  return createTenantUsecase
}
