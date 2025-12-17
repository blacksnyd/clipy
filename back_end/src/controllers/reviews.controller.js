import reviewsService from '../services/reviews.service.js';

export const createReview = async (req, res) => {
  try {
      const { rating, content, video_id } = req.body;

      if (!rating || !video_id) {
         return res.status(400).json({
         success: false,
         message: 'La note et la vidéo sont requises'
         });
      }

      if (isNaN(video_id)) {
         return res.status(400).json({
         success: false,
         message: 'Vidéo invalide'
         });
      }

      if (isNaN(rating) || rating < 1 || rating > 5) {
         return res.status(400).json({
         success: false,
         message: 'La note doit être un nombre entre 1 et 5'
         });
      }

      const reviewId = await reviewsService.createReview(rating, content || null, video_id);

      res.status(201).json({
         success: true,
         message: 'Review créé avec succès',
         data: { id: reviewId }
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Erreur lors de la création du review'
      });
   }
};

export const deleteReview = async (req, res) => {
   try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
         return res.status(400).json({
         success: false,
         message: 'ID invalide'
         });
      }

      const affectedRows = await reviewsService.deleteReview(id);

      if (affectedRows === 0) {
         return res.status(404).json({
         success: false,
         message: 'Review non trouvé'
         });
      }

      res.status(200).json({
         success: true,
         message: 'Review supprimé avec succès'
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Erreur lors de la suppression du review'
      });
   }
};

export const findReviewsByVideo = async (req, res) => {
   try {
      const video_id = Number(req.params.video_id);

      if (isNaN(video_id)) {
         return res.status(400).json({
         success: false,
         message: 'Vidéo invalide'
         });
      }

      const reviews = await reviewsService.findReviewsByVideo(video_id);

      res.status(200).json({
         success: true,
         data: reviews || []
      });
   } catch (error) {
      console.error('Erreur lors de la récupération des reviews:', error);
      res.status(500).json({
         success: false,
         message: 'Erreur lors de la récupération des reviews',
         error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
   }
};

export const findReviewById = async (req, res) => {
   try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
         return res.status(400).json({
         success: false,
         message: 'ID invalide'
         });
      }

      const review = await reviewsService.findReviewById(id);

      if (!review) {
         return res.status(404).json({
         success: false,
         message: 'Avis non trouvé'
         });
      }

      res.status(200).json({
         success: true,
         data: review
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Erreur lors de la récupération de l\'avis'
      });
   }
};
