import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'

import { tenants } from './tenants'
import { users } from './users'

export const members = pgTable(
  'members',
  {
    tenantId: uuid('tenant_id').references(() => tenants.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    role: varchar('role', {
      enum: [
        'LANDLORD',
        'TENANT',
        'ADMINISTRATOR',
        'COORDINATOR',
        'TEACHER',
        'RESPONSIBLE',
        'STUDENT',
      ],
    }).notNull(),
  },
  table => [primaryKey({ columns: [table.tenantId, table.userId] })]
)

export const membersRelations = relations(members, ({ one }) => ({
  tenant: one(tenants, {
    fields: [members.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}))
