import { Router } from 'express';

import {all} from '../controllers/categories.controller.js';

const router = Router();

router.get('/', all)

export default router;
