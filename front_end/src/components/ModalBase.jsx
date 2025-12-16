import { useEffect } from 'react'

function ModalShell({ isOpen, onClose, children, maxWidth = 'max-w-2xl', padding = 'p-6' }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = () => {
    onClose?.()
  }

  const handleContentClick = (event) => {
    event.stopPropagation()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleOverlayClick}>
      <div
        className={`relative mx-4 w-full ${maxWidth} rounded-lg bg-white ${padding} shadow-xl`}
        onClick={handleContentClick}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
          aria-label="Fermer la fenêtre modale"
          type="button"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}

export default ModalShell
