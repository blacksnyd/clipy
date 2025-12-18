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
  onCoverChange,
  showFileInput = false,
  showVideoInput = true,
  submitLabel,
  submitLoadingLabel,
  deleteLabel = 'Supprimer',
  deleteLoadingLabel = 'Suppression...',
  fileResetToken = 0
}) {
  const fileInputRef = useRef(null)
  const coverInputRef = useRef(null)

  useEffect(() => {
    if (showFileInput && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (coverInputRef.current) {
      coverInputRef.current.value = ''
    }
  }, [fileResetToken, showFileInput])

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleCoverClick = () => {
    coverInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    if (!onFileChange) return
    const file = e.target.files[0]
    const resetInput = () => {
      e.target.value = ''
    }
    onFileChange(file, resetInput)
  }

  const handleCoverChange = (e) => {
    if (!onCoverChange) return
    const file = e.target.files[0]
    const resetInput = () => {
      e.target.value = ''
    }
    onCoverChange(file, resetInput)
  }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="titre">
            Titre
          </label>
          <input
            id="titre"
            type="text"
            name="titre"
            value={formData.titre}
            onChange={onChange}
            placeholder="Entrez le titre de la vidéo"
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="categorie">
            Catégorie
          </label>
          <select
            id="categorie"
            name="categorie"
            value={formData.categorie}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Entrez la description de la vidéo"
            required
            className="w-full min-h-[120px] rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 disabled:cursor-not-allowed disabled:bg-slate-50 resize-none"
          />
        </div>

        {showFileInput && (
          <div className={`flex flex-col gap-6 ${showVideoInput ? 'md:flex-row md:items-start' : ''}`}>
            {showVideoInput && (
              <div className="w-full md:w-1/2 space-y-2">
                
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    key={`video-${fileResetToken}`}
                    id="video"
                    ref={fileInputRef}
                    type="file"
                    name="video"
                    onChange={handleFileChange}
                    accept="video/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleFileClick}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  >
                    Choisir une vidéo
                  </button>
                  <div className="flex flex-col text-xs italic text-slate-500 leading-tight">
                    <span>50 Mo max - 60 sec max</span>
                  </div>
                  {formData.video && (
                    <div className="flex-1 min-w-0 text-sm text-slate-700 truncate">
                      Fichier sélectionné :{' '}
                      <span className="font-medium text-slate-900 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        {formData.video.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={`w-full ${showVideoInput ? 'md:w-1/2' : ''} space-y-2`}>
              
              <div className="flex flex-wrap items-center gap-3">
                <input
                  key={`cover-${fileResetToken}`}
                  id="cover"
                  ref={coverInputRef}
                  type="file"
                  name="cover"
                  onChange={handleCoverChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleCoverClick}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                >
                  Choisir une image
                </button>
                <div className="flex flex-col text-xs italic text-slate-500 leading-tight">
                  <span>Image de couverture (optionnel)</span>
                  {formData.cover && (
                  <>
                    <div className="flex-1 min-w-0 max-w-[300px] text-sm text-slate-700 truncate">
                      {' '}
                      <span className="font-medium text-slate-900 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        {formData.cover.name}
                      </span>
                    </div>
                  </>
                )}
                </div>
                
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
          >
            Annuler
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={loading}
              className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              {loading ? deleteLoadingLabel : deleteLabel}
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-sky btn-sky-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            {loading ? submitLoadingLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Form
