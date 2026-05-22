import { z } from 'zod';
import { VotingAccess } from '../../common/constants/enums.js';

export const itemInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  imageUrl: z.string().url().max(2048).optional().or(z.literal('').transform(() => undefined)),
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
export const updateItemSchema = itemInputSchema.partial();
