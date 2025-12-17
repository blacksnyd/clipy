import { Router } from 'express';
import categoriesRoutes from './categories.routes.js';
import videosRoutes from './videos.routes.js';
import commentsRoutes from './comments.routes.js';
import reviewsRoutes from './reviews.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();


router.use('/categories', categoriesRoutes);
router.use('/videos', videosRoutes);
router.use('/comments', commentsRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/auth', authRoutes);


export default router;
