import { z } from 'zod';
import { VotingAccess } from '../../common/constants/enums.js';
export declare const itemInputSchema: z.ZodObject<{
    title: z.ZodString;
    imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>, z.ZodEffects<z.ZodLiteral<"">, undefined, "">]>;
}, "strip", z.ZodTypeAny, {
    title: string;
    imageUrl?: string | undefined;
}, {
    title: string;
    imageUrl?: string | undefined;
}>;
export declare const createVotingSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    access: z.ZodDefault<z.ZodNativeEnum<typeof VotingAccess>>;
    invitedEmails: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    items: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>, z.ZodEffects<z.ZodLiteral<"">, undefined, "">]>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        imageUrl?: string | undefined;
    }, {
        title: string;
        imageUrl?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    access: VotingAccess;
    invitedEmails: string[];
    items: {
        title: string;
        imageUrl?: string | undefined;
    }[];
    description?: string | undefined;
}, {
    title: string;
    items: {
        title: string;
        imageUrl?: string | undefined;
    }[];
    description?: string | undefined;
    access?: VotingAccess | undefined;
    invitedEmails?: string[] | undefined;
}>;
export type CreateVotingInput = z.infer<typeof createVotingSchema>;
export declare const updateSettingsSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    access: z.ZodOptional<z.ZodNativeEnum<typeof VotingAccess>>;
    invitedEmails: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    title?: string | undefined;
    access?: VotingAccess | undefined;
    invitedEmails?: string[] | undefined;
}, {
    description?: string | undefined;
    title?: string | undefined;
    access?: VotingAccess | undefined;
    invitedEmails?: string[] | undefined;
}>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export declare const addItemSchema: z.ZodObject<{
    title: z.ZodString;
    imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>, z.ZodEffects<z.ZodLiteral<"">, undefined, "">]>;
}, "strip", z.ZodTypeAny, {
    title: string;
    imageUrl?: string | undefined;
}, {
    title: string;
    imageUrl?: string | undefined;
}>;
export declare const updateItemSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>, z.ZodEffects<z.ZodLiteral<"">, undefined, "">]>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    imageUrl?: string | undefined;
}, {
    title?: string | undefined;
    imageUrl?: string | undefined;
}>;
export declare const reorderItemsSchema: z.ZodObject<{
    /** Full ordered list of item ids. Must match the board's current items. */
    itemIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    itemIds: string[];
}, {
    itemIds: string[];
}>;
export type ReorderItemsInput = z.infer<typeof reorderItemsSchema>;
//# sourceMappingURL=voting.schemas.d.ts.map