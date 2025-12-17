import { useEffect, useState } from 'react'
import { getAllCategories } from '../services/categories.service'
import { createVideo } from '../services/videos.service'
import { validateVideoFile, validateVideoPayload } from '../services/validation.service'
import { makeInputChangeHandler, makeVideoFileHandler, makeImageFileHandler } from '../utils/form.utils'
import Form from './Form'

function ModalCreate({ onClose = null, onVideoCreated = null }) {
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

  const handleChange = makeInputChangeHandler(setFormData)
  const handleVideoChange = makeVideoFileHandler({
    setFormData,
    setError,
    required: false
  })
  const handleCoverChange = makeImageFileHandler({
    setFormData,
    setError,
    fieldName: 'cover',
    required: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payloadValidation = validateVideoPayload(formData)
    if (!payloadValidation.valid) {
      setError(payloadValidation.error)
      return
    }
    const fileValidation = validateVideoFile(formData.video, { required: true })
    if (!fileValidation.valid) {
      setError(fileValidation.error)
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const uploadData = new FormData()
      uploadData.append('video', formData.video)
      if (formData.cover) {
        uploadData.append('cover', formData.cover)
      }
      uploadData.append('title', formData.titre.trim())
      uploadData.append('description', formData.description.trim())
      uploadData.append('category_id', formData.categorie)

      const response = await createVideo(uploadData)

      if (response.success) {
        setSuccess('Vidéo uploadée avec succès !')
        setFormData({
          titre: '',
          categorie: '',
          description: '',
          video: null,
          cover: null
        })
        setFileResetToken((prev) => prev + 1)
        
        // Appeler le callback pour recharger les vidéos
        if (onVideoCreated) {
          onVideoCreated()
        }
        
        if (onClose) {
          setTimeout(() => onClose(), 1500)
        }
      }
    } catch (err) {
      setError(err.message || "Erreur lors de l'upload de la vidéo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      title="Importer une vidéo"
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
      onChange={handleChange}
      onFileChange={handleVideoChange}
      onCoverChange={handleCoverChange}
      showFileInput
      submitLabel="Uploader la vidéo"
      submitLoadingLabel="Upload en cours..."
      fileResetToken={fileResetToken}
    />
  )
}

export default ModalCreate
