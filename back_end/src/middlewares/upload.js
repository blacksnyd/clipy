import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `video-${req.params.id}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});
const fileFilter = (req, file, cb) => {
  const allowed = ['video/mp4', 'video/mkv', 'video/webm', 'video/quicktime'];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format vidéo non autorisé'), false);
  }
};

const upload =  multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

export default upload
