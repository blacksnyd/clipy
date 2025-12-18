import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CardVideo from '../components/CardVideo'
import { getAllVideos, getVideosByTitle, getVideosByCategory } from '../services/videos.service'
import { getReviewsByVideo } from '../services/reviews.service'
import Pagination from '../components/Pagination'

const Homepage = ({ onCardClick, reloadTrigger = 0, searchCriteria = { searchTerm: '', categoryId: 'all' } }) => {
  const [videos, setVideos] = useState([])
  const [videosWithRatings, setVideosWithRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const { currentPage, totalPages } = pagination;

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        setError('')

        let response
        const hasSearchTerm = searchCriteria.searchTerm && searchCriteria.searchTerm.trim() !== ''
        const hasCategory = searchCriteria.categoryId && searchCriteria.categoryId !== 'all'

        if (hasSearchTerm && hasCategory) {
          response = await getVideosByTitle(searchCriteria.searchTerm.trim())
          if (response.success && response.data) {
            const videosArray = Array.isArray(response.data) ? response.data : []
            const filteredVideos = videosArray.filter(
              video => video.category_id === parseInt(searchCriteria.categoryId)
            )
            setVideos(filteredVideos)
            if (filteredVideos.length === 0) {
              setError('Aucune vidéo trouvée avec ces critères.')
              setVideosWithRatings([])
              return
            }
            const videosWithRatingsData = await Promise.all(
              filteredVideos.map(async (video) => {
                try {
                  const reviewsResponse = await getReviewsByVideo(video.id)
                  const reviews = reviewsResponse.success && reviewsResponse.data
                    ? (Array.isArray(reviewsResponse.data) ? reviewsResponse.data : [])
                    : []

                  const averageRating = reviews.length > 0
                    ? reviews.reduce((sum, review) => sum + (review.value || 0), 0) / reviews.length
                    : 0

                  return {
                    ...video,
                    averageRating: Number(averageRating.toFixed(1)),
                    ratingCount: reviews.length
                  }
                } catch {
                  return {
                    ...video,
                    averageRating: 0,
                    ratingCount: 0
                  }
                }
              })
            )
            setVideosWithRatings(videosWithRatingsData)
            return
          }
        } else if (hasSearchTerm) {
          response = await getVideosByTitle(searchCriteria.searchTerm.trim())
        } else if (hasCategory) {
          response = await getVideosByCategory(searchCriteria.categoryId)
        } else {
          response = await getAllVideos(currentPage)
        }

        if (response.success && response.data) {
          const videosArray = Array.isArray(response.data.videos) ? response.data.videos : []
          setVideos(videosArray)

          if (response.data.total_pages && response.data.current_page) {
            setPagination({
              totalPages: response.data.total_pages,
              currentPage: response.data.current_page
            });
          }

          const videosWithRatingsData = await Promise.all(
            videosArray.map(async (video) => {
              try {
                const reviewsResponse = await getReviewsByVideo(video.id)
                const reviews = reviewsResponse.success && reviewsResponse.data
                  ? (Array.isArray(reviewsResponse.data) ? reviewsResponse.data : [])
                  : []

                const averageRating = reviews.length > 0
                  ? reviews.reduce((sum, review) => sum + (review.value || 0), 0) / reviews.length
                  : 0

                return {
                  ...video,
                  averageRating: Number(averageRating.toFixed(1)),
                  ratingCount: reviews.length
                }
              } catch {
                return {
                  ...video,
                  averageRating: 0,
                  ratingCount: 0
                }
              }
            })
          )

          setVideosWithRatings(videosWithRatingsData)

          if (videosArray.length === 0 && (hasSearchTerm || hasCategory)) {
            setError('Aucune vidéo trouvée avec ces critères.')
          }
        } else {
          setError(response.message || (hasSearchTerm || hasCategory ? 'Aucune vidéo trouvée avec ces critères.' : 'Aucune vidéo trouvée.'))
        }
      } catch (error) {
        setError(error.message || 'Erreur lors du chargement des vidéos.')
      } finally {
        setLoading(false)
      }
    }
    loadVideos()
  }, [reloadTrigger, searchCriteria.searchTerm, searchCriteria.categoryId, currentPage])

  const handleCardClick = (video) => {
    if (onCardClick) {
      onCardClick(video)
    } else {
      navigate(`/video/${video.id}`)
    }
  }

  const handlePageChange = (page) => {
    setPagination({currentPage: page})
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
          <p className="text-slate-600">{error}</p>
        </div>
      </section>
    )
  }

  const hasSearchCriteria = (searchCriteria.searchTerm && searchCriteria.searchTerm.trim() !== '') ||
                            (searchCriteria.categoryId && searchCriteria.categoryId !== 'all')

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <p className="text-slate-600">
              {hasSearchCriteria ? 'Aucune vidéo trouvée avec ces critères.' : 'Aucune vidéo disponible'}
            </p>
          </div>
        ) : (
          videosWithRatings.map((video, index) => (
            <CardVideo
              key={video?.id ?? index}
              video={video}
              averageRating={video.averageRating}
              ratingCount={video.ratingCount}
              onClick={() => handleCardClick(video)}
            />
          ))
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  )
}

export default Homepage
