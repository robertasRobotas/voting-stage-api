import { z } from 'zod';
import { EUROVISION_POINTS } from '../../common/constants/index.js';
export const castVoteSchema = z.object({
    /** Optional display name for anonymous voters (shown next to their points). */
    voterName: z.string().trim().min(1).max(80).optional(),
    allocations: z
        .array(z.object({
        itemId: z.string().min(1),
        points: z.number().int().refine((p) => EUROVISION_POINTS.includes(p), {
            message: `points must be one of ${EUROVISION_POINTS.join(', ')}`,
        }),
    }))
        .min(1)
        .max(EUROVISION_POINTS.length),
});
//# sourceMappingURL=vote.schemas.js.map