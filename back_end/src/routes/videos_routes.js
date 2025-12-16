import { Router } from 'express';

import {all, create, deleteVideo, updateVideo} from '../controllers/videos_controller.js';

const router = Router();


router.get('/', all);
router.post('/', create);
router.put('/:id', updateVideo)
router.delete('/:id', deleteVideo)



export default router;
