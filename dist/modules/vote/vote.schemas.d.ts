import { z } from 'zod';
export declare const castVoteSchema: z.ZodObject<{
    /** Optional display name for anonymous voters (shown next to their points). */
    voterName: z.ZodOptional<z.ZodString>;
    allocations: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        points: z.ZodEffects<z.ZodNumber, number, number>;
    }, "strip", z.ZodTypeAny, {
        itemId: string;
        points: number;
    }, {
        itemId: string;
        points: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    allocations: {
        itemId: string;
        points: number;
    }[];
    voterName?: string | undefined;
}, {
    allocations: {
        itemId: string;
        points: number;
    }[];
    voterName?: string | undefined;
}>;
export type CastVoteInput = z.infer<typeof castVoteSchema>;
//# sourceMappingURL=vote.schemas.d.ts.map