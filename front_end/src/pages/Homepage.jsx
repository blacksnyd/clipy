import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CardVideo from '../components/CardVideo'
import { getAllVideos } from '../services/videos.service'

const Homepage = ({ onCardClick, reloadTrigger = 0 }) => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        const response = await getAllVideos()
        if (response.success && response.data) {
          setVideos(response.data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des vidéos:', error)
        setError('Erreur lors du chargement des vidéos.')
      } finally {
        setLoading(false)
      }
    }
    loadVideos()
  }, [reloadTrigger])

  const handleCardClick = (video) => {
    if (onCardClick) {
      onCardClick(video)
    } else {
      navigate(`/video/${video.id}`)
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-600">Chargement des vidéos...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <p className="text-slate-600">Aucune vidéo disponible</p>
          </div>
        ) : (
          videos.map((video, index) => (
            <CardVideo
              key={video?.id ?? index}
              video={video}
              onClick={() => handleCardClick(video)}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default Homepage
