import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rating } from '@smastrom/react-rating';
import { getVideoById } from '../services/videos.service';
import {
  getCommentsByVideo,
  createComment,
} from '../services/comments.service';
import {
  getReviewsByVideo,
  createReview,
} from '../services/reviews.service';
import { isAuthenticated, getUserId } from '../services/auth.service';
import ModalBase from '../components/modals/ModalBase';
import ModalUpdate from '../components/modals/ModalUpdate';
import editIcon from '../assets/editor-icone.png';

const DetailVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hasUserRated, setHasUserRated] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const authenticated = isAuthenticated();
  const userId = getUserId();

  useEffect(() => {
    const loadVideoData = async () => {
      if (!id) {
        setError('ID de vidéo manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Charger la vidéo d'abord (prioritaire)
        const videoResponse = await getVideoById(id);

        if (videoResponse.success && videoResponse.data) {
          setVideo(videoResponse.data);
        } else {
          setError(videoResponse.message || 'Vidéo non trouvée');
          setLoading(false);
          return;
        }

        // Charger les reviews et commentaires séparément (non bloquant)
        try {
          const reviewsResponse = await getReviewsByVideo(id);
          if (reviewsResponse.success && reviewsResponse.data) {
            setReviews(reviewsResponse.data);
            
            // Vérifier si l'utilisateur connecté a déjà noté cette vidéo
            if (authenticated && userId) {
              const currentUserId = parseInt(userId);
              const userReview = reviewsResponse.data.find(
                review => parseInt(review.user_id) === currentUserId
              );
              if (userReview) {
                setHasUserRated(true);
                setUserRating(userReview.value || 0);
              }
            }
          }
        } catch (reviewsError) {
          console.warn(
            'Erreur lors du chargement des reviews (non bloquant):',
            reviewsError
          );
          setReviews([]);
        }

        try {
          const commentsResponse = await getCommentsByVideo(id);
          if (commentsResponse.success && commentsResponse.data) {
            setComments(commentsResponse.data);
          }
        } catch (commentsError) {
          console.warn(
            'Erreur lors du chargement des commentaires (non bloquant):',
            commentsError
          );
          setComments([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la vidéo:', err);
        setError(err.message || 'Erreur lors du chargement de la vidéo');
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
  }, [id]);

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    const mean =
      reviews.reduce((sum, review) => sum + (review.value || 0), 0) /
      reviews.length;
    return Number(mean.toFixed(1));
  }, [reviews]);

  // Vérifier si l'utilisateur est le propriétaire de la vidéo
  const isVideoOwner = useMemo(() => {
    return authenticated && userId && video && parseInt(video.user_id) === parseInt(userId);
  }, [authenticated, userId, video]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    
    if (!authenticated) {
      setCommentError('Vous devez être connecté pour commenter.');
      return;
    }
    
    if (!commentText.trim()) {
      setCommentError('Merci de saisir un commentaire.');
      return;
    }

    setSubmitting(true);
    setCommentError('');

    try {
      // Créer le commentaire
      const commentPayload = {
        video_id: parseInt(id),
        content: commentText.trim(),
      };

      const commentResponse = await createComment(commentPayload);
      if (commentResponse?.success && commentResponse?.data) {
        // Recharger les commentaires pour avoir les données complètes
        const commentsResponse = await getCommentsByVideo(id);
        if (commentsResponse.success && commentsResponse.data) {
          setComments(commentsResponse.data);
        }
        
        // Réinitialiser le formulaire
        setCommentText('');
        setCommentError('');
      } else {
        setCommentError(commentResponse?.message || "Erreur lors de l'envoi du commentaire.");
      }
    } catch (err) {
      let errorMessage = err?.message || "Erreur lors de l'envoi du commentaire.";
      if (err?.message?.includes('401') || err?.message?.includes('authentifié')) {
        errorMessage = 'Vous devez être connecté pour commenter.';
      }
      setCommentError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!authenticated) {
      setCommentError('Vous devez être connecté pour noter.');
      return;
    }
    
    if (hasUserRated) {
      setCommentError('Vous avez déjà noté cette vidéo.');
      return;
    }
    
    if (!rating || rating <= 0) {
      return;
    }

    setSubmitting(true);
    setCommentError('');

    try {
      const reviewPayload = {
        video_id: parseInt(id),
        rating: rating,
      };

      const reviewResponse = await createReview(reviewPayload);
      if (reviewResponse?.success && reviewResponse?.data) {
        // Recharger les reviews pour mettre à jour la moyenne
        const reviewsResponse = await getReviewsByVideo(id);
        if (reviewsResponse.success && reviewsResponse.data) {
          setReviews(reviewsResponse.data);
          
          // Trouver la note de l'utilisateur et mettre à jour l'état
          if (authenticated && userId) {
            const currentUserId = parseInt(userId);
            const userReview = reviewsResponse.data.find(
              review => parseInt(review.user_id) === currentUserId
            );
            if (userReview) {
              setHasUserRated(true);
              setUserRating(userReview.value || 0);
            }
          }
        }
        setRating(0);
      } else {
        setCommentError(reviewResponse?.message || "Erreur lors de l'envoi de la note.");
      }
    } catch (err) {
      let errorMessage = err?.message || "Erreur lors de l'envoi de la note.";
      if (err?.message?.includes('401') || err?.message?.includes('authentifié')) {
        errorMessage = 'Vous devez être connecté pour noter.';
      } else if (err?.message?.includes('déjà noté')) {
        errorMessage = 'Vous avez déjà noté cette vidéo.';
        setHasUserRated(true);
      }
      setCommentError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCommentText('');
    setCommentError('');
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-lg text-slate-600">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-lg text-rose-600">
            {error || 'Vidéo non trouvée'}
          </p>
        </div>
      </div>
    );
  }

  const videoUrl = video.URL ? `${API_URL}/${video.URL}` : null;

  return (
    <div className="flex flex-1 flex-col items-stretch bg-slate-50">
      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 lg:grid-cols-[2fr_1fr]">
        {/* Zone vidéo */}
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {videoUrl ? (
            <video className="h-full w-full" controls src={videoUrl}>
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          ) : (
            <div className="flex h-96 items-center justify-center bg-slate-200">
              <p className="text-slate-500">Vidéo non disponible</p>
            </div>
          )}
        </div>

        {/* Détails */}
        <div className="flex h-full w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex w-full items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-slate-900">
                {video.title || 'Sans titre'}
              </h1>
              {isVideoOwner && (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="rounded-lg transition hover:scale-110 ml-auto cursor-pointer"
                >
                  <img src={editIcon} alt="edit" className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          <p className="text-base text-slate-700 leading-relaxed">
            {video.description || 'Aucune description disponible.'}
          </p>

          <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">
            <span className="inline-flex min-w-[96px] items-center justify-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 text-center">
              {average} / 5
            </span>
            
            {authenticated && hasUserRated ? (
              <div className="flex items-center gap-3">
                <Rating
                  style={{ maxWidth: 140 }}
                  value={userRating}
                  onChange={() => {}} // Désactivé en lecture seule
                  items={5}
                  readOnly
                />
                <span className="text-sm text-slate-700">
                  Ta note : {userRating} / 5
                </span>
              </div>
            ) : authenticated && !hasUserRated ? (
              <div className="flex items-center gap-3">
                <Rating
                  style={{ maxWidth: 140 }}
                  value={rating}
                  onChange={setRating}
                  items={5}
                />
                <span className="text-sm text-slate-700">
                  Ta note : {rating || '-'} / 5
                </span>
                {rating > 0 && (
                  <button
                    type="button"
                    onClick={handleSubmitRating}
                    disabled={submitting}
                    className="ml-auto border border-transparent btn-sky btn-sky-sm"
                  >
                    {submitting ? 'Envoi...' : 'Noter'}
                  </button>
                )}
              </div>
            ) : null}
          </div>

          {!authenticated ? (
            <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500 italic">
                Connectez-vous pour noter la vidéo ou ajouter un commentaire
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmitComment}
              className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4"
            >
              <label className="text-sm font-medium text-slate-800">
                Ajouter un commentaire
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
                placeholder="Partage ton avis sur la vidéo"
              />
              {commentError ? (
                <span className="text-sm text-rose-600">{commentError}</span>
              ) : null}
              <div className="flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="border border-transparent btn-sky btn-sky-lg"
                >
                  {submitting ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {comments.length > 0 && (
        <div className="mx-auto w-full max-w-6xl px-4 pb-8">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Commentaires
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                {comments.length} commentaire{comments.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
              {comments.map((comment) => (
                <div
                  key={comment._id || comment.id || comment.content}
                  className="rounded-lg bg-slate-50 p-3 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-slate-700">
                      {comment.username || 'Utilisateur'}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-800 leading-relaxed">
                    {comment.content || 'Pas de contenu'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ModalBase isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalUpdate 
          videoId={id} 
          onClose={() => {
            setIsEditModalOpen(false);
            // Recharger les données de la vidéo après update
            const reloadVideoData = async () => {
              try {
                const videoResponse = await getVideoById(id);
                if (videoResponse.success && videoResponse.data) {
                  setVideo(videoResponse.data);
                }
              } catch (err) {
                console.error('Erreur lors du rechargement de la vidéo:', err);
              }
            };
            reloadVideoData();
          }}
          onDeleteSuccess={() => {
            // Rediriger vers la homepage après suppression
            navigate('/');
          }}
        />
      </ModalBase>
    </div>
  );
};

export default DetailVideo;
