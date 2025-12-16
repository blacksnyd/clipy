import { useState, useRef, useEffect } from 'react'
import { getAllCategories } from '../services/categories.service'
import { createVideo, updateVideo, getVideoById, deleteVideo } from '../services/videos.service'

function AddModal({ videoId = null, onClose = null }) {
    const isEditMode = videoId !== null
    
    const [formData, setFormData] = useState({
        titre: '',
        categorie: '',
        description: '',
        video: null
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const fileInputRef = useRef(null)

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await getAllCategories()
                if (response.success && response.data) {
                    setCategories(response.data)
                }
            } catch (error) {
                console.error('Erreur lors du chargement des catégories:', error)
            }
        }
        loadCategories()
    }, [])

    useEffect(() => {
        const loadVideoData = async () => {
            if (isEditMode && videoId) {
                try {
                    const response = await getVideoById(videoId)
                    if (response.success && response.data) {
                        const video = response.data
                        setFormData({
                            titre: video.title || '',
                            categorie: video.category_id || '',
                            description: video.description || '',
                            video: null // On ne charge pas le fichier vidéo existant
                        })
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement de la vidéo:', error)
                    setError('Erreur lors du chargement de la vidéo.')
                }
            }
        }
        loadVideoData()
    }, [videoId, isEditMode])


    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'video') {
            const file = files[0]
            if (file) {
                // Vérification du type MIME
                if (file.type.startsWith('video/')) {
                    setFormData(prev => ({...prev, video: file}))
                    setError('')
                } else {
                    setError('Le fichier sélectionné n\'est pas une vidéo. Veuillez sélectionner un fichier vidéo.')
                    setFormData(prev => ({...prev, video: null}))
                    // Réinitialiser l'input file
                    e.target.value = ''
                }
            } else {
                setFormData(prev => ({...prev, video: null}))
                setError('')
            }
        } else {
            setFormData(prev => ({...prev, [name]: value}))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Vérification du titre
        if (!formData.titre || formData.titre.trim() === '') {
            setError('Veuillez saisir un titre.')
            return
        }
        
        // Vérification de la catégorie
        if (!formData.categorie || formData.categorie === '') {
            setError('Veuillez sélectionner une catégorie.')
            return
        }
        
        // Vérification de la description
        if (!formData.description || formData.description.trim() === '') {
            setError('Veuillez saisir une description.')
            return
        }
        
        // Vérification que la vidéo est présente (uniquement en mode création)
        if (!isEditMode && !formData.video) {
            setError('Veuillez sélectionner une vidéo.')
            return
        }
        
        // Vérification finale que le fichier est bien une vidéo (si une nouvelle vidéo est sélectionnée)
        if (formData.video && !formData.video.type.startsWith('video/')) {
            setError('Le fichier sélectionné n\'est pas une vidéo valide.')
            return
        }
        
        setLoading(true)
        setError('')
        setSuccess('')
        
        try {
            let response
            
            if (isEditMode) {
                // Mode édition : mise à jour avec JSON
                const updateData = {
                    title: formData.titre.trim(),
                    description: formData.description.trim(),
                    category_id: parseInt(formData.categorie)
                }
                
                response = await updateVideo(videoId, updateData)
                
                if (response.success) {
                    setSuccess('Vidéo mise à jour avec succès !')
                    // Fermer la modale après succès
                    if (onClose) {
                        setTimeout(() => onClose(), 1500)
                    }
                }
            } else {
                // Mode création : upload avec FormData
                const uploadData = new FormData()
                uploadData.append('video', formData.video)
                uploadData.append('title', formData.titre.trim())
                uploadData.append('description', formData.description.trim())
                uploadData.append('category_id', formData.categorie)
                
                response = await createVideo(uploadData)
                
                if (response.success) {
                    setSuccess('Vidéo uploadée avec succès !')
                    // Réinitialisation du formulaire
                    setFormData({
                        titre: '',
                        categorie: '',
                        description: '',
                        video: null
                    })
                    // Réinitialiser l'input file
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                    }
                    // Fermer la modale après succès
                    if (onClose) {
                        setTimeout(() => onClose(), 1500)
                    }
                }
            }
        } catch (error) {
            setError(error.message || (isEditMode ? 'Erreur lors de la mise à jour de la vidéo.' : 'Erreur lors de l\'upload de la vidéo.'))
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!isEditMode || !videoId) return
        
        // Confirmation avant suppression
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
                // Réinitialisation du formulaire
                setFormData({
                    titre: '',
                    categorie: '',
                    description: '',
                    video: null
                })
            }
        } catch (error) {
            setError(error.message || 'Erreur lors de la suppression de la vidéo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>{isEditMode ? 'Modifier la vidéo' : 'Poster une vidéo'}</h2>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <span>Titre</span>
                    </label>
                    <input
                        type="text"
                        name="titre"
                        value={formData.titre}
                        onChange={handleChange}
                        placeholder="Entrez le titre de la vidéo"
                        required
                    />
                </div>

                <div>
                    <label>
                        <span>Catégorie</span>
                    </label>
                    <select
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Sélectionnez une catégorie</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>
                        <span>Description</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Entrez la description de la vidéo"
                        required
                    />
                </div>

                {!isEditMode && (
                    <div>
                        <label>
                            <span>Vidéo</span>
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="video"
                            onChange={handleChange}
                            accept="video/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choisir une vidéo
                        </button>
                        {formData.video && (
                            <div>
                                <span>Fichier sélectionné: {formData.video.name}</span>
                            </div>
                        )}
                    </div>
                )}
                {isEditMode && formData.video && (
                    <div>
                        <label>
                            <span>Nouvelle vidéo (optionnel)</span>
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="video"
                            onChange={handleChange}
                            accept="video/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choisir une nouvelle vidéo
                        </button>
                        <div>
                            <span>Fichier sélectionné: {formData.video.name}</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div>
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div>
                        <span>{success}</span>
                    </div>
                )}

                <div>
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                titre: '',
                                categorie: '',
                                description: '',
                                video: null
                            })
                            setError('')
                            setSuccess('')
                            if (fileInputRef.current) {
                                fileInputRef.current.value = ''
                            }
                            if (onClose) {
                                onClose()
                            }
                        }}
                    >
                        Annuler
                    </button>
                    {isEditMode && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? 'Suppression...' : 'Supprimer la vidéo'}
                        </button>
                    )}
                    <button type="submit" disabled={loading}>
                        {loading 
                            ? (isEditMode ? 'Mise à jour en cours...' : 'Upload en cours...') 
                            : (isEditMode ? 'Mettre à jour la vidéo' : 'Uploader la vidéo')
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddModal