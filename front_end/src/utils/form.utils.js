import { validateVideoFile, validateImageFile } from '../services/validation.service'

export const makeInputChangeHandler = (setFormData) => (e) => {
  const { name, value } = e.target
  setFormData((prev) => ({ ...prev, [name]: value }))
}

export const makeVideoFileHandler = ({ setFormData, setError, required = false }) => {
  return (file, resetInput = () => {}) => {
    const { valid, error } = validateVideoFile(file, { required })
    if (!valid) {
      setError(error)
      setFormData((prev) => ({ ...prev, video: null }))
      resetInput()
      return
    }
    setFormData((prev) => ({ ...prev, video: file || null }))
    setError('')
  }
}

export const makeImageFileHandler = ({ setFormData, setError, fieldName = 'cover', required = false }) => {
  return (file, resetInput = () => {}) => {
    const { valid, error } = validateImageFile(file, { required })
    if (!valid) {
      setError(error)
      setFormData((prev) => ({ ...prev, [fieldName]: null }))
      resetInput()
      return
    }
    setFormData((prev) => ({ ...prev, [fieldName]: file || null }))
    setError('')
  }
}
