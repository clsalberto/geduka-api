import { hash } from 'bcrypt'
import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '~/database'
import { addresses, entities, members, users } from '~/database/schema'

import { Entity } from '~/services/entities'
import { Member } from '~/services/members'
import { User } from '~/services/users'

import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'

const phoneValidation = new RegExp(
  /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/
)

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
)

const taxIdValidation = new RegExp(
  /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/
)

const zipValidation = new RegExp(/^\d{5}\-\d{3}$/)

export async function createAccountRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/account/new',
    {
      schema: {
        body: z.object({
          name: z
            .string({
              message: 'Enter the name of the institution',
              required_error: '',
            })
            .min(3, {
              message:
                'The institution name must contain at least 3 characters',
            }),
          email: z
            .string({ required_error: 'Enter the institution email address' })
            .email({ message: 'Please enter a valid email address' }),
          phone: z
            .string()
            .regex(phoneValidation)
            .transform(value => value.replace(/\D/g, '')),
          password: z.string().regex(passwordValidation),
          taxId: z
            .string()
            .regex(taxIdValidation)
            .transform(value => value.replace(/\D/g, '')),
          role: z.enum([
            'LANDLORD',
            'TENANT',
            'ADMINISTRATOR',
            'COORDINATOR',
            'TEACHER',
            'EDUCATIONAL_RESPONSIBLE',
            'FINANCIAL_RESPONSIBLE',
            'STUDENT',
          ]),
          address: z.object({
            zip: z
              .string()
              .regex(zipValidation)
              .transform(value => value.replace(/\D/g, '')),
            place: z.string(),
            number: z.string(),
            complement: z.string().nullable(),
            district: z.string(),
            city: z.string(),
            state: z.string().length(2),
          }),
        }),
      },
    },
    async (request, reply) => {
      const {
        name,
        email,
        phone,
        password,
        role,
        taxId,
        address: location,
      } = request.body

      let address = await db.query.addresses.findFirst({
        where: and(
          eq(addresses.zip, location.zip),
          eq(addresses.place, location.place),
          eq(addresses.number, location.number),
          eq(addresses.complement, location.complement ?? ''),
          eq(addresses.district, location.district)
        ),
      })

      if (!address) {
        const newAddress = await db
          .insert(addresses)
          .values([{ ...location }])
          .returning()

        address = newAddress[0]
      }

      const entityByEmailExists = await db.query.entities.findFirst({
        where: eq(entities.email, email),
      })

      if (entityByEmailExists)
        throw new NotificationError(
          'Entity email already exists',
          HttpCode.BAD_REQUEST
        )

      const entityByPhoneExists = await db.query.entities.findFirst({
        where: eq(entities.phone, phone),
      })

      if (entityByPhoneExists)
        throw new NotificationError(
          'Entity phone already exists',
          HttpCode.BAD_REQUEST
        )

      const entityByTaxIdExists = await db.query.entities.findFirst({
        where: eq(entities.taxId, taxId),
      })

      if (entityByTaxIdExists)
        throw new NotificationError(
          'Entity tax id already exists',
          HttpCode.BAD_REQUEST
        )

      const userByEmailExists = await db.query.users.findFirst({
        where: eq(users.email, email),
      })

      if (userByEmailExists)
        throw new NotificationError(
          'User email already exists',
          HttpCode.BAD_REQUEST
        )

      const userByPhoneExists = await db.query.users.findFirst({
        where: eq(users.phone, phone),
      })

      if (userByPhoneExists)
        throw new NotificationError(
          'User phone already exists',
          HttpCode.BAD_REQUEST
        )

      const entity = await db
        .insert(entities)
        .values([{ name, email, phone, taxId, addressId: address.id }])
        .returning()

      const passwordHash = await hash(password, 10)

      const user = await db
        .insert(users)
        .values([
          {
            name,
            email,
            phone,
            password: passwordHash,
          },
        ])
        .returning()

      const memberExist = await db.query.members.findFirst({
        where: and(
          eq(members.entityId, entity[0].id),
          eq(members.userId, user[0].id)
        ),
      })

      if (memberExist)
        throw new NotificationError(
          'User is already a member of the entity',
          HttpCode.BAD_REQUEST
        )

      await db
        .insert(members)
        .values([{ entityId: entity[0].id, userId: user[0].id, role }])

      return reply
        .status(HttpCode.CREATED)
        .send({ message: 'Account created successfully' })
    }
  )
}
