import { Router } from 'express';
import upload from '../middlewares/upload_video.middleware.js';

import {all, show, create, deleteVideo, updateVideo, findVideoByTitle, findVideoByCategory} from '../controllers/videos.controller.js';

const router = Router();


router.get('/', all);
router.get('/:id', show);
router.get("/title/:title", findVideoByTitle);
router.get("/categories/:category_id", findVideoByCategory);
router.post('/', upload.single('video'),create);
router.put('/:id', updateVideo)
router.delete('/:id', deleteVideo)



export default router;
