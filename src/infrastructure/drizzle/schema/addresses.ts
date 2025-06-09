import { char, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey(),
  zip: char('zip', { length: 8 }).notNull(),
  place: text('place').notNull(),
  number: varchar('number', { length: 8 }).notNull(),
  complement: varchar('complement', { length: 80 }),
  district: varchar('district').notNull(),
  city: varchar('city').notNull(),
  state: char('state', { length: 2 }).notNull(),
})
