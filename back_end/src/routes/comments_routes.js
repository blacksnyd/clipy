import { Router } from 'express';

import { createComment, deleteComment, findCommentsByVideo } from '../controllers/comments_controller.js';

const router = Router();

router.post('/', createComment);
router.delete('/:id', deleteComment);
router.get('/:video_id', findCommentsByVideo);

export default router;