const isEmptyText = (value) => !value || value.trim() === ''

export const validateVideoPayload = ({ titre, categorie, description }) => {
  if (isEmptyText(titre)) {
    return { valid: false, error: 'Veuillez saisir un titre.' }
  }
  if (!categorie || categorie === '') {
    return { valid: false, error: 'Veuillez sélectionner une catégorie.' }
  }
  if (isEmptyText(description)) {
    return { valid: false, error: 'Veuillez saisir une description.' }
  }
  return { valid: true }
}

export const validateVideoFile = (file, { required = false } = {}) => {
  if (!file && required) {
    return { valid: false, error: 'Veuillez sélectionner une vidéo.' }
  }
  if (!file) {
    return { valid: true }
  }
  if (!file.type?.startsWith('video/')) {
    return { valid: false, error: "Le fichier sélectionné n'est pas une vidéo valide." }
  }
  return { valid: true }
}

export const validateImageFile = (file, { required = false } = {}) => {
  if (!file && required) {
    return { valid: false, error: 'Veuillez sélectionner une image.' }
  }
  if (!file) {
    return { valid: true }
  }
  if (!file.type?.startsWith('image/')) {
    return { valid: false, error: "Le fichier sélectionné n'est pas une image valide." }
  }
  return { valid: true }
}