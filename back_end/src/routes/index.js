import { Router } from 'express';
import categoriesRoutes from './categories_routes.js';
import videosRoutes from './videos_routes.js';

const router = Router();


router.use('/categories', categoriesRoutes);
router.use('/videos', videosRoutes);



export default router;
