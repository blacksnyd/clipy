import { Router } from 'express';
import multer from 'multer';
import uploads from '../middlewares/uploads.middleware.js';
import {
  all,
  show,
  create,
  deleteVideo,
  updateVideo,
} from '../controllers/videos.controller.js';

const router = Router();

const upload_files = uploads.fields([
  { name: 'video', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);

const handle_upload = (req, res, next) => {
  upload_files(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Le fichier est trop volumineux. Taille maximale : 50 Mo',
        });
      }

      return res.status(400).json({
        success: false,
        message: `Erreur Multer : ${err.code}`,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};
router.get('/', all);
router.get('/:id', show);
router.post('/', handle_upload, create);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

export default router;
