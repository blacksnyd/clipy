import multer from 'multer';
import path from 'path';
import { v6 as uuidv6 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, 'uploads/videos/');
    } else if (file.fieldname === 'cover') {
      cb(null, 'uploads/covers/');
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uuidv6()}${ext}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === 'video' &&
    file.mimetype.startsWith('video/')
  ) {
    return cb(null, true);
  }
  if (
    file.fieldname === 'cover' &&
    file.mimetype.startsWith('image/')
  ) {
    return cb(null, true);
  }

  cb(new Error('Type de fichier non autorisé'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export default upload;
