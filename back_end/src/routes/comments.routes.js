import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createComment, deleteComment, findCommentsByVideo } from '../controllers/comments.controller.js';
import { createCommentSchema } from "../middlewares/validations/comments.validation.js";
import { validate } from "../middlewares/validations/validate.js";

const router = Router();

router.post('/', validate(createCommentSchema), authenticate, createComment);
router.delete('/:id', authenticate, deleteComment);
router.get('/:video_id', findCommentsByVideo);

export default router;
