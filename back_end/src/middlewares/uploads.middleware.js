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
    const file_ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uuidv6()}${file_ext}`);
  },
});

const image_ext = ['.png', '.jpg', '.jpeg'];
const video_ext = ['.mp4', '.webm', '.mkv', '.mov'];

const image_mime = ['image/png', 'image/jpeg'];
const video_mime = [
  'video/mp4',
  'video/webm',
  'video/x-matroska',
  'video/quicktime',
];

const file_filter = (req, file, cb) => {
  const file_ext = path.extname(file.originalname).toLowerCase();

  if (!['video', 'cover'].includes(file.fieldname)) {
    return cb(new Error('Champ de fichier invalide'));
  }
  if (file.fieldname === 'video') {
    if (!video_ext.includes(file_ext)) {
      return cb(new Error('Extension de la vidéo invalide'));
    }

    if (!video_mime.includes(file.mimetype)) {
      return cb(new Error('Mimetype de la vidéo invalide'));
    }

    return cb(null, true);
  }
  if (file.fieldname === 'cover') {
    if (!image_ext.includes(file_ext)) {
      return cb(new Error('Extension de l\'image invalide'));
    }

    if (!image_mime.includes(file.mimetype)) {
      return cb(new Error('Mimetype de l\'image invalide'));
    }

    return cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter: file_filter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export default upload;
