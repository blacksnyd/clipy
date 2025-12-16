import { validateVideoFile } from '../services/validation.service'

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
