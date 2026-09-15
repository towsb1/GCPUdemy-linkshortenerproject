import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: text().notNull().unique(),
  url: text().notNull(),
  userId: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;