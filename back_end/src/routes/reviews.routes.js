import { Router } from 'express';

import { createReview, deleteReview, findReviewsByVideo, findReviewById } from '../controllers/reviews.controller.js';

const router = Router();

router.post('/', createReview);
router.delete('/:id', deleteReview);
router.get('/video/:video_id', findReviewsByVideo);
router.get('/:id', findReviewById);

export default router;

