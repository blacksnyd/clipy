import { Router } from 'express';

import {all, create} from '../controllers/videos_controller.js';

const router = Router();


router.get('/', all);
router.post('/', create);



export default router;
