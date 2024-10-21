import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Address } from '~/services/addresses'
import { Entity } from '~/services/entities'
import { Member } from '~/services/members'
import { User } from '~/services/users'

import { HttpCode } from '~/shared/http'
import { Role } from '~/shared/role'

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

export const createAccountRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/account/new',
    {
      schema: {
        body: z.object({
          name: z.string().min(3),
          email: z.string().email(),
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
          location: z.object({
            zip: z
              .string()
              .regex(zipValidation)
              .transform(value => value.replace(/\D/g, '')),
            place: z.string(),
            number: z.string(),
            complement: z.string().optional(),
            district: z.string(),
            city: z.string(),
            state: z.string().length(2),
          }),
        }),
      },
    },
    async (request, reply) => {
      const { location, name, email, phone, password, role, taxId } =
        request.body

      try {
        const { address } = await Address.load(location)

        const { entity, notify: entityNotify } = await Entity.create({
          name,
          email,
          phone,
          taxId,
          addressId: address.id,
        })

        if (entityNotify)
          return reply
            .status(entityNotify.code)
            .send({ message: entityNotify.message })

        const { user, notify: userNotify } = await User.create({
          name,
          email,
          phone,
          password,
        })

        if (userNotify)
          return reply
            .status(userNotify.code)
            .send({ message: userNotify.message })

        const { notify: memberNotify } = await Member.create({
          entityId: entity.id,
          userId: user.id,
          role,
        })

        if (memberNotify)
          return reply
            .status(memberNotify.code)
            .send({ message: memberNotify.message })

        return reply
          .status(HttpCode.CREATED)
          .send({ message: 'Account created successfully' })
      } catch (error) {
        if (error instanceof Error)
          return reply.status(HttpCode.BAD_REQUEST).send({ error })
      }
    }
  )
}
