import React, { useState } from 'react'
import { register } from '../../services/auth.service'

const Register = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.username.trim()) {
      setError('Le nom d\'utilisateur est obligatoire.')
      return false
    }

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

    // Vérifier la longueur du mot de passe
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return false
    }

    // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
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
      // Préparer les données pour l'API (sans confirmPassword)
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      }

      // Appeler le service d'inscription
      const response = await register(userData)

      if (response.success) {
        setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.')
        
        // Réinitialiser le formulaire
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        })

        // Fermer la modal après 2 secondes pour laisser le temps de voir le message de succès
        setTimeout(() => {
          onClose?.()
        }, 2000)
      } else {
        setError(response.message || 'Une erreur est survenue lors de l\'inscription.')
      }
    } catch (err) {
      // Gérer les erreurs du serveur
      const errorMessage = err.message || err.error?.message || 'Une erreur est survenue lors de l\'inscription.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Créer un compte</h2>
        <p className="text-sm text-slate-500">Tous les champs sont obligatoires.</p>
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
        <label htmlFor="username" className="text-sm font-medium text-slate-700">
          Nom d&apos;utilisateur
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

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

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={formData.confirmPassword}
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
          {loading ? 'Création en cours...' : 'Créer mon compte'}
        </button>
      </div>
    </form>
  )
}

export default Register