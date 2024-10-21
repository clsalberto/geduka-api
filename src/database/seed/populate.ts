import { createId } from '@paralleldrive/cuid2'
import { hashSync } from 'bcrypt'

import { Role } from '~/shared/role'

import { db } from '..'
import { addresses, entities, members, users } from '../schema'

async function populate() {
  const addressTb = await db
    .insert(addresses)
    .values([
      {
        id: createId(),
        zip: '60540232',
        place: 'Rua Nova Conquista',
        number: '2837',
        complement: 'Casa A',
        district: 'Granaja Lisboa',
        city: 'Fortaleza',
        state: 'CE',
      },
      {
        id: createId(),
        zip: '60741200',
        place: 'Rua Alvares Cabral',
        number: '601',
        district: 'Serrinha',
        city: 'Fortaleza',
        state: 'CE',
      },
    ])
    .returning()

  const entityTb = await db
    .insert(entities)
    .values([
      {
        id: createId(),
        name: 'Escola Teste 1',
        email: 'escola1@teste.com',
        phone: '85988764563',
        taxId: '87654768000198',
        addressId: addressTb[0].id,
      },
      {
        id: createId(),
        name: 'Escola Teste 2',
        email: 'escola2@teste.com',
        phone: '85988345726',
        taxId: '88760902000198',
        addressId: addressTb[1].id,
      },
    ])
    .returning()

  const userTb = await db
    .insert(users)
    .values([
      {
        id: createId(),
        name: 'Escola Teste 1',
        email: entityTb[0].email,
        password: hashSync('secret', 10),
        phone: '85988796417',
      },
      {
        id: createId(),
        name: 'Escola Teste 2',
        email: entityTb[1].email,
        password: hashSync('secret', 10),
        phone: '85988796418',
      },
      {
        id: createId(),
        name: 'User Teste 1',
        email: 'user1@teste.com',
        password: hashSync('secret', 10),
        phone: '85988796419',
      },
      {
        id: createId(),
        name: 'User Teste 2',
        email: 'user2@teste.com',
        password: hashSync('secret', 10),
        phone: '85988796420',
      },
      {
        id: createId(),
        name: 'User Teste 3',
        email: 'user3@teste.com',
        password: hashSync('secret', 10),
        phone: '85988796421',
      },
      {
        id: createId(),
        name: 'User Teste 4',
        email: 'user4@teste.com',
        password: hashSync('secret', 10),
        phone: '85988796422',
      },
    ])
    .returning()

  await db.insert(members).values([
    {
      role: Role.TENANT,
      entityId: entityTb[0].id,
      userId: userTb[0].id,
    },
    {
      role: Role.TENANT,
      entityId: entityTb[1].id,
      userId: userTb[1].id,
    },

    {
      role: Role.ADMINISTRATOR,
      entityId: entityTb[0].id,
      userId: userTb[2].id,
    },
    {
      role: Role.COORDINATOR,
      entityId: entityTb[0].id,
      userId: userTb[3].id,
    },
    {
      role: Role.TEACHER,
      entityId: entityTb[0].id,
      userId: userTb[4].id,
    },

    {
      role: Role.ADMINISTRATOR,
      entityId: entityTb[1].id,
      userId: userTb[3].id,
    },
    {
      role: Role.COORDINATOR,
      entityId: entityTb[1].id,
      userId: userTb[4].id,
    },
    {
      role: Role.TEACHER,
      entityId: entityTb[1].id,
      userId: userTb[5].id,
    },
  ])
}

populate()
