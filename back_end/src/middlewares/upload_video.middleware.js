import multer from 'multer';
import path from 'path';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    const uuid =  uuidv6();
    const ext = path.extname(file.originalname);
    const filename = `video-${uuid}${ext}`;
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
