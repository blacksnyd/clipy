import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Rating } from '@smastrom/react-rating';
import { getVideoById } from '../services/videos.service';
import editIcon from '../assets/editor-icone.png';

const DetailVideo = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

        // Charger les reviews séparément (non bloquant)
        try {
          const reviewsResponse = await getReviewsByVideo(id);
          if (reviewsResponse.success && reviewsResponse.data) {
            setReviews(reviewsResponse.data);
          }
        } catch (reviewsError) {
          console.warn(
            'Erreur lors du chargement des reviews (non bloquant):',
            reviewsError
          );
          // On continue même si les reviews ne se chargent pas
          setReviews([]);
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
    <div className="flex flex-1 items-stretch bg-slate-50">
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
              <button className="rounded-lg transition hover:scale-110 ml-auto">
                <img src={editIcon} alt="edit" className="w-6 h-6" />
              </button>
            </div>
          </div>

          <p className="text-base text-slate-700 leading-relaxed">
            {video.description || 'Aucune description disponible.'}
          </p>

          <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">
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
            </div>
            <span className="inline-flex min-w-[96px] items-center justify-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 text-center">
              {average} / 5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailVideo;
