import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { links, type Link } from "@/db/schema";

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
