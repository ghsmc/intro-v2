import { pgTable, uuid, varchar, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const quickMatchSessions = pgTable('quick_match_sessions', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').notNull(),
  domain: varchar('domain', { length: 50 }).notNull(),
  profile: jsonb('profile').notNull(),
  conversation: jsonb('conversation').notNull().default('[]'),
  matches: jsonb('matches').notNull().default('[]'),
  currentStep: varchar('current_step', { length: 10 }).notNull().default('0'),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const quickMatchSessionsRelations = relations(quickMatchSessions, ({ one }) => ({
  user: one(quickMatchSessions, {
    fields: [quickMatchSessions.userId],
    references: [quickMatchSessions.id]
  })
}));

export type QuickMatchSession = typeof quickMatchSessions.$inferSelect;
export type NewQuickMatchSession = typeof quickMatchSessions.$inferInsert;
