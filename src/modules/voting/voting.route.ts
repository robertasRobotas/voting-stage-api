import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import * as votingController from './voting.controller.js';
import {
  createVotingSchema,
  updateSettingsSchema,
  addItemSchema,
  updateItemSchema,
} from './voting.schemas.js';

const router = Router();

// Owner endpoints
router.post('/', authMiddleware, validate(createVotingSchema), votingController.create);
router.get('/', authMiddleware, votingController.listMine);

// Public-by-shareId. Auth is optional so the same handler powers signed-in
// owners (who get results + invite list) and anonymous voters.
router.get('/share/:shareId', optionalAuthMiddleware, votingController.getPublic);

// Lifecycle (owner-only — assertion lives in the service)
router.post('/:id/finish', authMiddleware, votingController.finish);
router.post('/:id/resume', authMiddleware, votingController.resume);

router.patch(
  '/:id/settings',
  authMiddleware,
  validate(updateSettingsSchema),
  votingController.updateSettings,
);

router.post('/:id/items', authMiddleware, validate(addItemSchema), votingController.addItem);
router.patch(
  '/:id/items/:itemId',
  authMiddleware,
  validate(updateItemSchema),
  votingController.updateItem,
);
router.delete('/:id/items/:itemId', authMiddleware, votingController.removeItem);

export default router;
