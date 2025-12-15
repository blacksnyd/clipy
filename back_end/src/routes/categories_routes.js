import { Router } from 'express';

import {all} from '../controllers/categories_controller.js';

const router = Router();

router.get('/', all)

export default router;
