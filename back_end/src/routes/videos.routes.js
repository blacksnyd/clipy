import { Router } from 'express';
import uploads from '../middlewares/uploads.middleware.js';
import handle_upload from '../middlewares/handle_upload.middleware.js';

import {all, show, create, deleteVideo, updateVideo, findVideoByTitle, findVideoByCategory} from '../controllers/videos.controller.js';

const router = Router();

const upload_files = uploads.fields([
  { name: 'video', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);

router.get('/', all);
router.get('/:id', show);
router.get("/title/:title", findVideoByTitle);
router.get("/categories/:category_id", findVideoByCategory);
router.post('/', handle_upload(upload_files), create);
router.put('/:id', updateVideo)
router.delete('/:id', deleteVideo)



export default router;
