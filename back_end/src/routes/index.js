import { Router } from 'express';
import categoriesRoutes from './categories.routes.js';
import videosRoutes from './videos.routes.js';

const router = Router();


router.use('/categories', categoriesRoutes);
router.use('/videos', videosRoutes);
router.use('/comments', commentsRoutes);


export default router;
