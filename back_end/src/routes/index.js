import { Router } from 'express';
import categoriesRoutes from './categories.routes.js';

const router = Router();


router.use('/categories', categoriesRoutes);



export default router;
