"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createLink,
  deleteLinkForUser,
  getLinkByIdForUser,
  getLinkBySlug,
  updateLinkForUser,
} from "@/data/links";

const slugSchema = z
  .string()
  .trim()
  .min(3, "Custom slug must be at least 3 characters.")
  .max(32, "Custom slug must be 32 characters or fewer.")
  .regex(
    /^[a-zA-Z0-9-_]+$/,
    "Custom slug can only contain letters, numbers, hyphens, and underscores."
  );

const createLinkSchema = z.object({
  url: z.string().trim().min(1, "Enter a URL.").url("Enter a valid URL."),
  slug: slugSchema.optional().or(z.literal("")),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

export type CreateLinkResult =
  | { success: true; slug: string }
  | { error: string };

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().trim().min(1, "Enter a URL.").url("Enter a valid URL."),
  slug: slugSchema,
});

export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export type UpdateLinkResult = { success: true } | { error: string };

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export type DeleteLinkResult = { success: true } | { error: string };

function generateSlug(): string {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * Creates a new short link for the currently signed-in user.
 */
export async function createLinkAction(
  input: CreateLinkInput
): Promise<CreateLinkResult> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be signed in to create a link." };
  }

  const parsed = createLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const slug =
    parsed.data.slug && parsed.data.slug.length > 0
      ? parsed.data.slug
      : generateSlug();

  try {
    const existing = await getLinkBySlug(slug);

    if (existing) {
      return { error: "That short link is already taken. Try another." };
    }

    await createLink({ url: parsed.data.url, slug, userId });
  } catch {
    return { error: "Something went wrong while creating the link." };
  }

  revalidatePath("/dashboard");

  return { success: true, slug };
}

/**
 * Updates an existing short link's URL and/or slug for the currently
 * signed-in user.
 */
export async function updateLinkAction(
  input: UpdateLinkInput
): Promise<UpdateLinkResult> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be signed in to update a link." };
  }

  const parsed = updateLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const existing = await getLinkByIdForUser(parsed.data.id, userId);

    if (!existing) {
      return { error: "Link not found." };
    }

    if (parsed.data.slug !== existing.slug) {
      const slugTaken = await getLinkBySlug(parsed.data.slug);

      if (slugTaken) {
        return { error: "That short link is already taken. Try another." };
      }
    }

    const updated = await updateLinkForUser(parsed.data.id, userId, {
      url: parsed.data.url,
      slug: parsed.data.slug,
    });

    if (!updated) {
      return { error: "Link not found." };
    }
  } catch {
    return { error: "Something went wrong while updating the link." };
  }

  revalidatePath("/dashboard");

  return { success: true };
}

/**
 * Deletes an existing short link for the currently signed-in user.
 */
export async function deleteLinkAction(
  input: DeleteLinkInput
): Promise<DeleteLinkResult> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be signed in to delete a link." };
  }

  const parsed = deleteLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const deleted = await deleteLinkForUser(parsed.data.id, userId);

    if (!deleted) {
      return { error: "Link not found." };
    }
  } catch {
    return { error: "Something went wrong while deleting the link." };
  }

  revalidatePath("/dashboard");

  return { success: true };
}
