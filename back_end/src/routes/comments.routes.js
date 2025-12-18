import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createComment, deleteComment, findCommentsByVideo } from '../controllers/comments.controller.js';

const router = Router();

router.post('/', authenticate, createComment);
router.delete('/:id', authenticate, deleteComment);
router.get('/:video_id', findCommentsByVideo);

export default router;