import { useEffect, useState } from 'react'
import { getAllCategories } from '../services/categories.service'
import { deleteVideo, getVideoById, updateVideo } from '../services/videos.service'
import { validateVideoPayload } from '../services/validation.service'
import { makeInputChangeHandler, makeImageFileHandler } from '../utils/form.utils'
import Form from './Form'

function ModalUpdate({ videoId, onClose = null, onDeleteSuccess = null }) {
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
  const [fileResetToken, setFileResetToken] = useState(0)

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
      const uploadData = new FormData()
      
      // Ajouter seulement la cover si elle est fournie (pas de vidéo)
      if (formData.cover) {
        uploadData.append('cover', formData.cover)
      }
      
      // Toujours ajouter les données texte
      uploadData.append('title', formData.titre.trim())
      uploadData.append('description', formData.description.trim())
      uploadData.append('category_id', formData.categorie)

      const response = await updateVideo(videoId, uploadData)

      if (response.success) {
        setSuccess('Vidéo mise à jour avec succès !')
        setFormData({
          titre: '',
          categorie: '',
          description: '',
          video: null,
          cover: null
        })
        setFileResetToken((prev) => prev + 1)
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
        // Appeler le callback après un court délai pour laisser le temps de voir le message
        if (onDeleteSuccess) {
          setTimeout(() => {
            onClose?.()
            onDeleteSuccess()
          }, 1500)
        } else if (onClose) {
          setTimeout(() => onClose(), 1500)
        }
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
        setFileResetToken((prev) => prev + 1)
        if (onClose) {
          onClose()
        }
      }}
      onDelete={handleDelete}
      onChange={handleChange}
      onCoverChange={handleCoverChange}
      showFileInput
      showVideoInput={false}
      submitLabel="Mettre à jour la vidéo"
      submitLoadingLabel="Mise à jour en cours..."
      deleteLabel="Supprimer la vidéo"
      deleteLoadingLabel="Suppression..."
      fileResetToken={fileResetToken}
    />
  )
}

export default ModalUpdate
