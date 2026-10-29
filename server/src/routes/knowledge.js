import { Router } from 'express';
import { getKnowledge, getKnowledgeItem, createKnowledge, updateKnowledge, deleteKnowledge } from '../controllers/knowledgeController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.route('/').get(getKnowledge).post(createKnowledge);
router.route('/:id').get(getKnowledgeItem).put(updateKnowledge).delete(deleteKnowledge);
export default router;
