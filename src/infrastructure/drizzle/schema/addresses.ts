import { char, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey(),
  zip: char('zip', { length: 8 }).notNull(),
  place: text('place').notNull(),
  number: varchar('number', { length: 8 }).notNull(),
  complement: varchar('complement', { length: 60 }),
  district: varchar('district', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  state: char('state', { length: 2 }).notNull(),
})
