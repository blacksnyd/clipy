import commentsService from '../services/comments.service.js';

export const createComment = async (req, res) => {
  try {
      const { content, video_id } = req.body;

      if (!content || !video_id) {
         return res.status(400).json({
         success: false,
         message: 'Le contenu est requis'
         });
      }

      if (isNaN(video_id)) {
         return res.status(400).json({
         success: false,
         message: 'Vidéo invalide'
         });
      }

      const commentId = await commentsService.createComment(content, video_id);

      res.status(201).json({
         success: true,
         message: 'Commentaire créé avec succès',
         data: { id: commentId }
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Erreur lors de la création du commentaire'
      });
   }
};

export const deleteComment = async (req, res) => {
   try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
         return res.status(400).json({
         success: false,
         message: 'ID invalide'
         });
      }

      const affectedRows = await commentsService.deleteComment(id);

      if (affectedRows === 0) {
         return res.status(404).json({
         success: false,
         message: 'Commentaire non trouvé'
         });
      }

      res.status(200).json({
         success: true,
         message: 'Commentaire supprimé avec succès'
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Erreur lors de la suppression du commentaire'
      });
   }
};

export const findCommentsByVideo = async (req, res) => {
   try {
      const video_id = Number(req.params.video_id);

      if (isNaN(video_id)) {
         return res.status(400).json({
         success: false,
         message: 'ID de vidéo invalide'
         });
      }

      const comments = await commentsService.findCommentsByVideo(video_id);

      res.status(200).json({
         success: true,
         data: comments
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: 'Erreur lors de la récupération des commentaires'
      });
   }
};