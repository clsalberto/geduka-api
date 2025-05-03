import {
  char,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { addresses } from './addresses'

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
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
