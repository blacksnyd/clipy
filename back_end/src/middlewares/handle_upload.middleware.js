import multer from 'multer';

const handle_upload = (upload_files) => (req, res, next) => {
  upload_files(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Le fichier est trop volumineux. Taille maximale : 50 Mo',
        });
      }

      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: 'Fichier ou champ inattendu. Seuls "video" et "cover" sont autorisés',
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

export default handle_upload;
