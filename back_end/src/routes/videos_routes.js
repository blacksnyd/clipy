import { Router } from 'express';

import {all} from '../controllers/videos_controller.js';

const router = Router();


router.get('/', all);



export default router;
