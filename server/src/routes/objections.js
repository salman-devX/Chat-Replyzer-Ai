import { Router } from 'express';
import { getObjections, getObjection, createObjection, updateObjection, deleteObjection } from '../controllers/objectionController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.route('/').get(getObjections).post(createObjection);
router.route('/:id').get(getObjection).put(updateObjection).delete(deleteObjection);
export default router;
