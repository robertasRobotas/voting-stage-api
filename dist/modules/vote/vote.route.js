import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { optionalAuthMiddleware } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import * as voteController from './vote.controller.js';
import { castVoteSchema } from './vote.schemas.js';
// mergeParams so :votingId from the parent mount survives.
const router = Router({ mergeParams: true });
// Per-(board × identity) limit. A signed-in user is keyed by userId, an
// anonymous voter by their localStorage token, falling back to IP. This caps
// "drive-by" spam without blocking legitimate edits to one's ballot. The
// global app-level limiter still applies on top of this.
const voteLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 12,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => {
        const votingId = req.params.votingId ?? 'unknown';
        const identity = req.user?.userId ??
            req.header('x-anon-token') ??
            req.header('X-Anon-Token') ??
            req.ip ??
            'anon';
        return `vote:${votingId}:${identity}`;
    },
    message: {
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many vote submissions, slow down.' },
    },
});
router.post('/', optionalAuthMiddleware, voteLimiter, validate(castVoteSchema), voteController.cast);
router.get('/mine', optionalAuthMiddleware, voteController.mine);
export default router;
//# sourceMappingURL=vote.route.js.map