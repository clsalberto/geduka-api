import { relations } from 'drizzle-orm'
import {
  boolean,
  char,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import { members } from './members'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  image: text('image'),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  phone: char('phone', { length: 11 }).notNull().unique(),
  password: varchar('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  activated: boolean('activated').notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  members: many(members),
}))
