import { Router } from 'express';
import uploads from '../middlewares/uploads.middleware.js';

import {all, show, create, deleteVideo, updateVideo} from '../controllers/videos.controller.js';

const router = Router();

const uploadFiles = uploads.fields([
  { name: 'video', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]);



router.get('/', all);
router.get('/:id', show);
router.post('/', uploadFiles,create);
router.put('/:id', updateVideo)
router.delete('/:id', deleteVideo)



export default router;
