import React, { useMemo, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import editIcon from '../assets/editor-icone.png';

const DetailVideo = () => {
  // A remplacer par le fetch
  const allRatings = [4, 5, 3, 4, 5];

  const [rating, setRating] = useState(0);

  const average = useMemo(() => {
    if (!allRatings.length) return 0;
    const mean =
      allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length;
    return Number(mean.toFixed(1));
  }, [allRatings]);

  return (
    <div className="flex flex-1 items-stretch bg-slate-50">
      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 lg:grid-cols-[2fr_1fr]">
        {/* Zone vidéo */}
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/jOQNpF5itew"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          
        </div>

        {/* Détails */}
        <div className="flex h-full w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">
                Vidéo
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Titre de la vidéo
              </h1>
            </div>
            <span className="inline-flex min-w-[96px] items-center justify-center rounded-full bg-slate-100 p-4 text-sm text-slate-600 text-center">
              {average} / 5
            </span>
            <button className="rounded-lg transition hover:scale-110">
              <img src={editIcon} alt="edit" className="w-10 h-10" />
            </button>
          </div>

          <p className="text-base text-slate-700 leading-relaxed">
            Description de la vidéo.
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
            <p className="text-sm text-slate-700">
              Note moyenne : <span className="font-semibold">{average}</span> /
              5
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailVideo;
