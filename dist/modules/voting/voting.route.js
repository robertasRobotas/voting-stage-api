import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/validate.middleware.js';
import * as votingController from './voting.controller.js';
import { createVotingSchema, updateSettingsSchema, addItemSchema, updateItemSchema, reorderItemsSchema, } from './voting.schemas.js';
const router = Router();
router.post('/', authMiddleware, validate(createVotingSchema), votingController.create);
router.get('/', authMiddleware, votingController.listMine);
router.get('/share/:shareId', optionalAuthMiddleware, votingController.getPublic);
router.post('/:id/finish', authMiddleware, votingController.finish);
router.post('/:id/resume', authMiddleware, votingController.resume);
router.delete('/:id', authMiddleware, votingController.remove);
router.patch('/:id/settings', authMiddleware, validate(updateSettingsSchema), votingController.updateSettings);
router.post('/:id/items', authMiddleware, validate(addItemSchema), votingController.addItem);
router.patch('/:id/items/:itemId', authMiddleware, validate(updateItemSchema), votingController.updateItem);
router.delete('/:id/items/:itemId', authMiddleware, votingController.removeItem);
router.post('/:id/items/reorder', authMiddleware, validate(reorderItemsSchema), votingController.reorderItems);
export default router;
//# sourceMappingURL=voting.route.js.map