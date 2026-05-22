import { Router } from 'express';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import * as authController from './auth.controller.js';

const router = Router();

// Returns the current user. Triggers user upsert in the auth middleware as a
// side effect, so the frontend can call this right after Firebase sign-in to
// ensure a DB record exists.
router.get('/me', authMiddleware, authController.me);

export default router;
