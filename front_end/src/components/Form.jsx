import { useEffect, useRef } from 'react'

function Form({
  title,
  formData,
  categories = [],
  error = '',
  success = '',
  loading = false,
  onSubmit,
  onCancel,
  onDelete,
  onChange,
  onFileChange,
  showFileInput = false,
  submitLabel,
  submitLoadingLabel,
  deleteLabel = 'Supprimer',
  deleteLoadingLabel = 'Suppression...',
  fileResetToken = 0
}) {
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (showFileInput && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [fileResetToken, showFileInput])

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    if (!onFileChange) return
    const file = e.target.files[0]
    const resetInput = () => {
      e.target.value = ''
    }
    onFileChange(file, resetInput)
  }

  return (
    <div>
      <h2>{title}</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label>
            <span>Titre</span>
          </label>
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            placeholder="Entrez la description de la vidéo"
            required
          />
        </div>

        {showFileInput && (
          <div>
            <label>
              <span>Vidéo</span>
            </label>
            <input
              key={fileResetToken}
              ref={fileInputRef}
              type="file"
              name="video"
              onChange={handleFileChange}
              accept="video/*"
              style={{ display: 'none' }}
            />
            <button type="button" onClick={handleFileClick}>
              Choisir une vidéo
            </button>
            {formData.video && (
              <div>
                <span>Fichier sélectionné: {formData.video.name}</span>
              </div>
            )}
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
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
          {onDelete && (
            <button type="button" onClick={onDelete} disabled={loading}>
              {loading ? deleteLoadingLabel : deleteLabel}
            </button>
          )}
          <button type="submit" disabled={loading}>
            {loading ? submitLoadingLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Form
