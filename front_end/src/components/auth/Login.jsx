import React, { useState } from 'react'
import { login } from '../../services/auth.service'

const Login = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Réinitialiser les erreurs quand l'utilisateur modifie le formulaire
    if (error) setError('')
  }

  const validateForm = () => {
    // Vérifier que tous les champs sont remplis
    if (!formData.email.trim()) {
      setError('L\'email est obligatoire.')
      return false
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer un email valide.')
      return false
    }

    if (!formData.password) {
      setError('Le mot de passe est obligatoire.')
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Réinitialiser les messages
    setError('')
    setSuccess('')

    // Valider le formulaire
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Préparer les données pour l'API
      const credentials = {
        email: formData.email.trim(),
        password: formData.password,
      }

      // Appeler le service de connexion
      const response = await login(credentials)

      if (response.success) {
        // Le token est déjà sauvegardé automatiquement par le service login
        const username = response.data?.user?.username || response.data?.username || 'Utilisateur'
        setSuccess(`Connexion réussie ! Bienvenue ${username}.`)
        
        // Réinitialiser le formulaire
        setFormData({
          email: '',
          password: '',
        })

        // Fermer la modal après 1.5 secondes pour laisser le temps de voir le message de succès
        setTimeout(() => {
          onClose?.()
          // Recharger la page pour mettre à jour l'état de l'application (afficher les boutons de déconnexion, etc.)
          window.location.reload()
        }, 1500)
      } else {
        setError(response.message || 'Une erreur est survenue lors de la connexion.')
      }
    } catch (err) {
      // Gérer les erreurs du serveur
      let errorMessage = 'Une erreur est survenue lors de la connexion.'
      
      if (err.message) {
        errorMessage = err.message
      } else if (err.error?.message) {
        errorMessage = err.error.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      // Messages d'erreur spécifiques
      if (errorMessage.includes('Identifiants invalides') || errorMessage.includes('401')) {
        errorMessage = 'Email ou mot de passe incorrect.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Se connecter</h2>
        <p className="text-sm text-slate-500">Entrez vos identifiants pour vous connecter.</p>
      </div>

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

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-sky btn-sky-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </div>

      <div className="text-center text-sm text-slate-600">
        Pas de compte ?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold text-sky-600 transition hover:text-sky-700 cursor-pointer"
        >
          Créer un compte
        </button>
      </div>
    </form>
  )
}

export default Login