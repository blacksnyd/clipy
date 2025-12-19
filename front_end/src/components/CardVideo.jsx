import React, { useState, useRef, useEffect } from 'react'
import { Rating } from '@smastrom/react-rating'
import imageDefault from '../assets/image-default.png'

const CardVideo = ({
  video,
  title = 'Titre de la vidéo',
  description = '',
  thumbnail = imageDefault,
  averageRating = 0,
  ratingCount = 0,
  onClick = null
}) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef(null)
  
  const resolvedTitle = video?.title ?? title
  const resolvedDescription = video?.description ?? description
  
  // Utiliser cover si disponible, sinon thumbnail, sinon image par défaut
  const coverUrl = video?.cover 
    ? `${API_URL}/${video.cover}` 
    : (video?.thumbnail ?? thumbnail)
  
  const resolvedThumbnail = coverUrl
  const resolvedAverageRating = Number(video?.averageRating ?? averageRating ?? 0)
  const resolvedRatingCount = video?.ratingCount ?? ratingCount
  const videoUrl = video?.URL ? `${API_URL}/${video.URL}` : null

  const displayRating = Number(resolvedAverageRating || 0)

  // Gérer la lecture de la vidéo au survol
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      if (isHovered) {
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error('Erreur lors de la lecture de la vidéo:', err)
          })
        }
      } else {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [isHovered, videoUrl])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <article
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
    >
      <div className="aspect-video w-full overflow-hidden bg-slate-200 relative">
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className={`h-full w-full object-cover absolute inset-0 transition-opacity duration-200 ${
              isHovered ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        )}
        <img
          src={resolvedThumbnail}
          alt={resolvedTitle}
          className={`h-full w-full object-cover transition-all duration-200 ${
            isHovered && videoUrl ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
          }`}
          onError={(e) => {
            console.error('Erreur de chargement de l\'image:', resolvedThumbnail)
            e.target.src = imageDefault
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
            {resolvedTitle}
          </h3>
          {resolvedDescription ? (
            <p className="text-xs text-slate-600 line-clamp-2">{resolvedDescription}</p>
          ) : null}
        </div>

        <div className="mt-auto flex items-center gap-2">
          <Rating style={{ maxWidth: 88 }} value={displayRating} items={5} readOnly />
          <span className="text-xs text-slate-700">
            {displayRating % 1 === 0 ? displayRating.toString() : displayRating.toFixed(1)} / 5
          </span>
          {resolvedRatingCount ? (
            <span className="text-[11px] text-slate-500">({resolvedRatingCount})</span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default CardVideo
