import { Router } from 'express';

import {all, show} from '../controllers/videos_controller.js';

const router = Router();


router.get('/', all);
router.get('/:id', show);



export default router;
