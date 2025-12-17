import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CardVideo from '../components/CardVideo'
import { getAllVideos, getVideosByTitle, getVideosByCategory } from '../services/videos.service'

const Homepage = ({ onCardClick, reloadTrigger = 0, searchCriteria = { searchTerm: '', categoryId: 'all' } }) => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        setError('')
        
        let response
        const hasSearchTerm = searchCriteria.searchTerm && searchCriteria.searchTerm.trim() !== ''
        const hasCategory = searchCriteria.categoryId && searchCriteria.categoryId !== 'all'
        
        // Si les deux critères sont renseignés : recherche par titre puis filtrage par catégorie
        if (hasSearchTerm && hasCategory) {
          response = await getVideosByTitle(searchCriteria.searchTerm.trim())
          if (response.success && response.data) {
            // Filtrer les résultats par catégorie côté frontend
            const filteredVideos = response.data.filter(
              video => video.category_id === parseInt(searchCriteria.categoryId)
            )
            setVideos(filteredVideos)
            if (filteredVideos.length === 0) {
              setError('Aucune vidéo trouvée avec ces critères.')
            }
            setLoading(false)
            return
          }
        }
        // Si seulement une recherche par titre est spécifiée
        else if (hasSearchTerm) {
          response = await getVideosByTitle(searchCriteria.searchTerm.trim())
        }
        // Si seulement une catégorie spécifique est sélectionnée
        else if (hasCategory) {
          response = await getVideosByCategory(searchCriteria.categoryId)
        }
        // Sinon, charger toutes les vidéos
        else {
          response = await getAllVideos()
        }
        
        if (response.success && response.data) {
          setVideos(response.data)
          // Si aucun résultat et qu'il y a des critères de recherche
          if (response.data.length === 0 && (hasSearchTerm || hasCategory)) {
            setError('Aucune vidéo trouvée avec ces critères.')
          }
        } else {
          setError(response.message || (hasSearchTerm || hasCategory ? 'Aucune vidéo trouvée avec ces critères.' : 'Aucune vidéo trouvée.'))
        }
      } catch (error) {
        console.error('Erreur lors du chargement des vidéos:', error)
        setError(error.message || 'Erreur lors du chargement des vidéos.')
      } finally {
        setLoading(false)
      }
    }
    loadVideos()
  }, [reloadTrigger, searchCriteria.searchTerm, searchCriteria.categoryId])

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
