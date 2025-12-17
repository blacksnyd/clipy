import { useEffect, useState } from 'react'
import { getAllCategories } from '../services/categories.service'
import { deleteVideo, getVideoById, updateVideo } from '../services/videos.service'
import { validateVideoPayload } from '../services/validation.service'
import { makeInputChangeHandler, makeImageFileHandler } from '../utils/form.utils'
import Form from './Form'

function ModalUpdate({ videoId, onClose = null }) {
  const [formData, setFormData] = useState({
    titre: '',
    categorie: '',
    description: '',
    video: null,
    cover: null
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getAllCategories()
        if (response.success && response.data) {
          setCategories(response.data)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const loadVideoData = async () => {
      if (!videoId) return
      try {
        const response = await getVideoById(videoId)
        if (response.success && response.data) {
          const video = response.data
          setFormData({
            titre: video.title || '',
            categorie: video.category_id || '',
            description: video.description || '',
            video: null,
            cover: null
          })
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la vidéo:', err)
        setError('Erreur lors du chargement de la vidéo.')
      }
    }
    loadVideoData()
  }, [videoId])

  const handleChange = makeInputChangeHandler(setFormData)
  const handleCoverChange = makeImageFileHandler({
    setFormData,
    setError,
    fieldName: 'cover',
    required: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!videoId) return

    const payloadValidation = validateVideoPayload(formData)
    if (!payloadValidation.valid) {
      setError(payloadValidation.error)
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updateData = {
        title: formData.titre.trim(),
        description: formData.description.trim(),
        category_id: parseInt(formData.categorie)
      }

      const response = await updateVideo(videoId, updateData)

      if (response.success) {
        setSuccess('Vidéo mise à jour avec succès !')
        if (onClose) {
          setTimeout(() => onClose(), 1500)
        }
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour de la vidéo.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!videoId) return
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await deleteVideo(videoId)
      if (response.success) {
        setSuccess('Vidéo supprimée avec succès !')
        setFormData({
          titre: '',
          categorie: '',
          description: '',
          video: null,
          cover: null
        })
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression de la vidéo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      title="Modifier la vidéo"
      formData={formData}
      categories={categories}
      error={error}
      success={success}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={() => {
        setFormData({
          titre: '',
          categorie: '',
          description: '',
          video: null,
          cover: null
        })
        setError('')
        setSuccess('')
        if (onClose) {
          onClose()
        }
      }}
      onDelete={handleDelete}
      onChange={handleChange}
      onCoverChange={handleCoverChange}
      submitLabel="Mettre à jour la vidéo"
      submitLoadingLabel="Mise à jour en cours..."
      deleteLabel="Supprimer la vidéo"
      deleteLoadingLabel="Suppression..."
    />
  )
}

export default ModalUpdate
