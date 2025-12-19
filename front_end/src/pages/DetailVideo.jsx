import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rating } from '@smastrom/react-rating';
import { getVideoById } from '../services/videos.service';
import { getCommentsByVideo, createComment } from '../services/comments.service';
import { getReviewsByVideo, createReview } from '../services/reviews.service';
import { isAuthenticated, getUserId } from '../services/auth.service';
import ModalBase from '../components/modals/ModalBase';
import ModalUpdate from '../components/modals/ModalUpdate';
import editIcon from '../assets/editor-icone.png';

const DetailVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ===================== STATES ===================== */
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

  /* ===================== REFS ===================== */
  const bgVideoRef = useRef(null);
  const mainVideoRef = useRef(null);

  /* ===================== CONSTANTS ===================== */
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const authenticated = isAuthenticated();
  const userId = getUserId();

  // ⭐ TAILLE UNIQUE DES ÉTOILES
  const RATING_STYLE = { maxWidth: 140 };

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    const loadVideoData = async () => {
      try {
        setLoading(true);

        const videoResponse = await getVideoById(id);
        if (!videoResponse.success) throw new Error('Vidéo non trouvée');
        setVideo(videoResponse.data);

        const reviewsResponse = await getReviewsByVideo(id);
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.data);
          if (authenticated && userId) {
            const review = reviewsResponse.data.find(
              r => parseInt(r.user_id) === parseInt(userId)
            );
            if (review) {
              setHasUserRated(true);
              setUserRating(review.value);
            }
          }
        }

        const commentsResponse = await getCommentsByVideo(id);
        if (commentsResponse.success) {
          setComments(commentsResponse.data);
        }
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
  }, [id]);

  /* ===================== COMPUTED ===================== */
  const average = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((sum, r) => sum + (r.value || 0), 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  const isVideoOwner = useMemo(() => {
    return authenticated && video && parseInt(video.user_id) === parseInt(userId);
  }, [authenticated, video, userId]);

  /* ===================== VIDEO SYNC ===================== */
  const handlePlay = () => bgVideoRef.current?.play();
  const handlePause = () => bgVideoRef.current?.pause();

  /* ===================== COMMENT ===================== */
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!authenticated) {
      setCommentError('Vous devez être connecté pour commenter.');
      return;
    }

    if (!commentText.trim()) {
      setCommentError('Merci de saisir un commentaire.');
      return;
    }

    try {
      setSubmitting(true);
      await createComment({
        video_id: parseInt(id),
        content: commentText.trim(),
      });

      const commentsResponse = await getCommentsByVideo(id);
      if (commentsResponse.success) {
        setComments(commentsResponse.data);
      }

      setCommentText('');
      setCommentError('');
    } catch {
      setCommentError("Erreur lors de l'envoi du commentaire.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCommentText('');
    setCommentError('');
  };

  /* ===================== UI STATES ===================== */
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-600">Chargement de la vidéo...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <p className="text-lg text-rose-600">{error}</p>
      </div>
    );
  }

  const videoUrl = video.URL ? `${API_URL}/${video.URL}` : null;

  /* ===================== RENDER ===================== */
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[2fr_1fr]">

        {/* VIDEO */}
        <div className="relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200">
          {videoUrl && (
            <>
              <video
                ref={bgVideoRef}
                src={videoUrl}
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-60"
                aria-hidden
              />

              <video
                ref={mainVideoRef}
                src={videoUrl}
                controls
                playsInline
                onPlay={handlePlay}
                onPause={handlePause}
                className="relative z-10 w-full max-h-[600px] object-contain"
              />
            </>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{video.title}</h1>
            {isVideoOwner && (
              <button onClick={() => setIsEditModalOpen(true)}>
                <img src={editIcon} alt="edit" className="w-6 h-6" />
              </button>
            )}
          </div>

          <p className="text-slate-700">{video.description}</p>

          <div className="rounded-xl bg-slate-50 p-4 space-y-4">
            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm inline-block mb-1">
              {average} / 5
            </span>

            {authenticated && hasUserRated && (
              <div className="flex items-center gap-3">
                <Rating
                  value={userRating}
                  readOnly
                  style={RATING_STYLE}
                />
                <span className="text-sm font-semibold text-slate-700">
                  Ma note : {userRating} / 5
                </span>
              </div>
            )}

            {authenticated && !hasUserRated && (
              <div className="flex items-center gap-3">
                <Rating
                  value={rating}
                  onChange={setRating}
                  style={RATING_STYLE}
                />
                {rating > 0 && (
                  <button
                    onClick={async () => {
                      await createReview({ video_id: id, rating });
                      window.location.reload();
                    }}
                    className="btn-sky btn-sky-sm"
                  >
                    Noter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ADD COMMENT */}
          {authenticated ? (
            <form onSubmit={handleSubmitComment} className="flex flex-col gap-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="min-h-[80px] rounded-lg border border-slate-200 p-2 text-sm"
              />
              {commentError && (
                <span className="text-sm text-rose-600">{commentError}</span>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={!commentText.trim()}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="btn-sky btn-sky-sm"
                >
                  {submitting ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm italic text-slate-500">
              Connectez-vous pour commenter
            </p>
          )}
        </div>
      </div>

      {/* COMMENT LIST */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-lg font-semibold">
            Commentaires ({comments.length})
          </h2>

          <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment.id || comment._id}
                className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100"
              >
                <p className="text-xs font-semibold text-slate-700">
                  {comment.username || 'Utilisateur'}
                </p>
                <p className="text-sm text-slate-800">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <ModalBase isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalUpdate
          videoId={id}
          onDeleteSuccess={() => navigate('/')}
          onClose={() => setIsEditModalOpen(false)}
        />
      </ModalBase>
    </div>
  );
};

export default DetailVideo;
