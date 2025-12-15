import { useState, useRef } from 'react'

function AddModal() {
    
    const [formData, setFormData] = useState({
        titre: '',
        categorie: '',
        description: '',
        video: null
    })
    const [error, setError] = useState('')
    const fileInputRef = useRef(null)

    const categories = [
        'Musique',
        'Gaming',
        'Sport',
        'Autre'
    ]


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

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Vérification que la vidéo est présente
        if (!formData.video) {
            setError('Veuillez sélectionner une vidéo.')
            return
        }
        
        // Vérification finale que le fichier est bien une vidéo
        if (!formData.video.type.startsWith('video/')) {
            setError('Le fichier sélectionné n\'est pas une vidéo valide.')
            return
        }
        
        // logique pour envoyer les données au backend
        console.log('Données du formulaire:', formData)
        
        // Réinitialisation du formulaire
        setFormData({
            titre: '',
            categorie: '',
            description: '',
            video: null
        })
        setError('')
    }

    return (
        <div>
            <h2>Poster une vidéo</h2>
            
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
                            <option key={cat} value={cat}>
                                {cat}
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
                    {error && (
                        <div>
                            <span>{error}</span>
                        </div>
                    )}
                </div>

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
                        }}
                    >
                        Annuler
                    </button>
                    <button type="submit">
                        Uploader la vidéo
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddModal