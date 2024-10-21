import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'

import {
  char,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const addresses = pgTable('addresses', {
  id: char('id', { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId()),
  zip: char('zip', { length: 8 }).notNull(),
  place: text('place').notNull(),
  number: varchar('number', { length: 20 }).notNull(),
  complement: varchar('complement', { length: 60 }),
  district: varchar('district').notNull(),
  city: varchar('city').notNull(),
  state: char('state', { length: 2 }).notNull(),
})

export const entities = pgTable('entities', {
  id: char('id', { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar('name').notNull(),
  email: varchar('email').unique().notNull(),
  phone: char('phone', { length: 11 }).unique().notNull(),
  taxId: varchar('tax_id', { length: 14 }).unique().notNull(),
  addressId: char('address_id', { length: 24 })
    .references(() => addresses.id)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const entitiesRelations = relations(entities, ({ one }) => ({
  address: one(addresses, {
    fields: [entities.addressId],
    references: [addresses.id],
  }),
}))

export const users = pgTable('users', {
  id: char('id', { length: 24 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar('name').notNull(),
  email: varchar('email').unique().notNull(),
  phone: char('phone', { length: 11 }).unique().notNull(),
  password: text('password').notNull(),
  activedAt: timestamp('actived_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  usersToMembers: many(members),
}))

export const members = pgTable(
  'members',
  {
    entityId: char('entity_id', { length: 24 })
      .references(() => entities.id)
      .notNull(),
    userId: char('user_id', { length: 24 })
      .references(() => users.id)
      .notNull(),
    role: varchar('role').notNull(),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.entityId, table.userId] }),
    }
  }
)

export const membersRelations = relations(members, ({ one }) => ({
  entity: one(entities, {
    fields: [members.entityId],
    references: [entities.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}))
