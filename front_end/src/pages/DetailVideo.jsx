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

  const bgVideoRef = useRef(null);
  const mainVideoRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const authenticated = isAuthenticated();
  const userId = getUserId();

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
        if (commentsResponse.success) setComments(commentsResponse.data);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
  }, [id]);

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((sum, r) => sum + (r.value || 0), 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  const isVideoOwner = useMemo(() => {
    return authenticated && video && parseInt(video.user_id) === parseInt(userId);
  }, [authenticated, video, userId]);

  const handlePlay = () => {
    bgVideoRef.current?.play();
  };

  const handlePause = () => {
    bgVideoRef.current?.pause();
  };

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

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[2fr_1fr]">

        {/* VIDEO */}
        <div className="relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200">
          {videoUrl && (
            <>
              {/* Background flouté */}
              <video
                ref={bgVideoRef}
                src={videoUrl}
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-60"
                aria-hidden
              />

              {/* Vidéo principale */}
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

          <div className="rounded-xl bg-slate-50 p-4">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
              {average} / 5
            </span>

            {authenticated && hasUserRated && (
              <Rating value={userRating} readOnly style={{ maxWidth: 140 }} />
            )}

            {authenticated && !hasUserRated && (
              <div className="flex items-center gap-3 mt-2">
                <Rating value={rating} onChange={setRating} />
                {rating > 0 && (
                  <button onClick={async () => {
                    await createReview({ video_id: id, rating });
                    window.location.reload();
                  }} className="btn-sky btn-sky-sm">
                    Noter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

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
