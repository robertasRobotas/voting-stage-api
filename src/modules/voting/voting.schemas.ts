import { z } from 'zod';
import { VotingAccess } from '../../common/constants/enums.js';

/** Stricter URL guard than plain `z.string().url()` — only http(s), bounded length. */
const httpImageUrl = z
  .string()
  .trim()
  .max(2048)
  .url()
  .refine((u) => /^https?:\/\//i.test(u), { message: 'imageUrl must be http(s)' });

/** On create, an empty string simply means "no image". */
const imageUrlSchema = httpImageUrl.optional().or(z.literal('').transform(() => undefined));

export const itemInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  imageUrl: imageUrlSchema,
});

export const createVotingSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  access: z.nativeEnum(VotingAccess).default(VotingAccess.LINK),
  invitedEmails: z.array(z.string().email()).max(500).default([]),
  items: z.array(itemInputSchema).min(2).max(200),
});
export type CreateVotingInput = z.infer<typeof createVotingSchema>;

export const updateSettingsSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  access: z.nativeEnum(VotingAccess).optional(),
  invitedEmails: z.array(z.string().email()).max(500).optional(),
});
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

export const addItemSchema = itemInputSchema;

/**
 * On update, the empty string must SURVIVE parsing: `''` means "clear the
 * image" while an absent field means "leave it unchanged". Reusing the create
 * schema here would collapse `''` to undefined and make clearing impossible.
 */
export const updateItemSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  imageUrl: httpImageUrl.or(z.literal('')).optional(),
});

export const reorderItemsSchema = z.object({
  /** Full ordered list of item ids. Must match the board's current items. */
  itemIds: z.array(z.string().min(1)).min(1).max(200),
});
export type ReorderItemsInput = z.infer<typeof reorderItemsSchema>;
