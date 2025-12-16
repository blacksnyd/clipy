import { Router } from 'express';
import upload from '../middlewares/upload_video.js';

import {all, show, create, deleteVideo, updateVideo} from '../controllers/videos_controller.js';

const router = Router();


router.get('/', all);
router.get('/:id', show);
router.post('/', upload.single('video'),create);
router.put('/:id', updateVideo)
router.delete('/:id', deleteVideo)



export default router;
