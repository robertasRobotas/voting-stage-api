import { Router } from 'express';
import { optionalAuthMiddleware } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import * as voteController from './vote.controller.js';
import { castVoteSchema } from './vote.schemas.js';

// mergeParams so :votingId from the parent mount survives.
const router = Router({ mergeParams: true });

router.post('/', optionalAuthMiddleware, validate(castVoteSchema), voteController.cast);
router.get('/mine', optionalAuthMiddleware, voteController.mine);

export default router;
