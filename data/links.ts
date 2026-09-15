import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { links, type Link, type NewLink } from "@/db/schema";

/**
 * Fetches all links owned by the given user, newest first.
 */
export async function getLinksForUser(userId: string): Promise<Link[]> {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}

/**
 * Fetches a single link by its slug, or undefined if no link uses that slug.
 */
export async function getLinkBySlug(slug: string): Promise<Link | undefined> {
  const [link] = await db.select().from(links).where(eq(links.slug, slug));
  return link;
}

/**
 * Inserts a new link and returns the created record.
 */
export async function createLink(data: NewLink): Promise<Link> {
  const [link] = await db.insert(links).values(data).returning();
  return link;
}

/**
 * Fetches a single link by id, scoped to the owning user.
 */
export async function getLinkByIdForUser(
  id: number,
  userId: string
): Promise<Link | undefined> {
  const [link] = await db
    .select()
    .from(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)));
  return link;
}

/**
 * Updates a link's URL and/or slug, scoped to the owning user. Returns the
 * updated record, or undefined if no matching link was found for the user.
 */
export async function updateLinkForUser(
  id: number,
  userId: string,
  data: Partial<Pick<NewLink, "url" | "slug">>
): Promise<Link | undefined> {
  const [link] = await db
    .update(links)
    .set(data)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return link;
}

/**
 * Deletes a link, scoped to the owning user. Returns true if a link was
 * deleted, false if no matching link was found for the user.
 */
export async function deleteLinkForUser(
  id: number,
  userId: string
): Promise<boolean> {
  const deleted = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return deleted.length > 0;
}
