import { z } from 'zod';
import { VotingAccess } from '../../common/constants/enums.js';
/**
 * Stricter URL guard than plain `z.string().url()` — only http(s), bounded
 * length. Empty string is normalized to undefined so the form can clear an
 * image without an explicit null.
 */
const imageUrlSchema = z
    .string()
    .trim()
    .max(2048)
    .url()
    .refine((u) => /^https?:\/\//i.test(u), { message: 'imageUrl must be http(s)' })
    .optional()
    .or(z.literal('').transform(() => undefined));
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
export const updateSettingsSchema = z.object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    access: z.nativeEnum(VotingAccess).optional(),
    invitedEmails: z.array(z.string().email()).max(500).optional(),
});
export const addItemSchema = itemInputSchema;
export const updateItemSchema = itemInputSchema.partial();
export const reorderItemsSchema = z.object({
    /** Full ordered list of item ids. Must match the board's current items. */
    itemIds: z.array(z.string().min(1)).min(1).max(200),
});
//# sourceMappingURL=voting.schemas.js.map