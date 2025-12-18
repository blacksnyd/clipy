import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';

import { createReview, deleteReview, findReviewsByVideo, findReviewById } from '../controllers/reviews.controller.js';

const router = Router();

router.post('/', authenticate, createReview);
router.delete('/:id', authenticate, deleteReview);
router.get('/video/:video_id', findReviewsByVideo);
router.get('/:id', findReviewById);

export default router;

