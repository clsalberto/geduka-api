import { relations } from 'drizzle-orm'
import {
  char,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import { addresses } from './addresses'
import { members } from './members'

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey(),
  image: text('image'),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: char('phone', { length: 11 }).notNull().unique(),
  taxId: varchar('tax_id', { length: 14 }).notNull().unique(),
  addressId: uuid('address_id')
    .references(() => addresses.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  address: one(addresses, {
    fields: [tenants.addressId],
    references: [addresses.id],
  }),
  members: many(members),
}))
