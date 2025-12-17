import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getAllCategories } from '../services/categories.service'

const SearchBar = ({ onSearchChange }) => {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const navigate = useNavigate()
  const location = useLocation()

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const criteria = {
      searchTerm: searchTerm.trim(),
      categoryId: selectedCategory
    }
    
    if (onSearchChange) {
      onSearchChange(criteria)
    }
    
    // Si on est sur la page DetailVideo, rediriger vers Homepage
    if (location.pathname.startsWith('/video/')) {
      navigate('/', { replace: false })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center rounded-xl border border-slate-200 bg-white shadow-sm transition focus-within:border-slate-400 focus-within:shadow-md">
      <span className="px-3 text-slate-400">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m21 21-4.35-4.35m1.35-4.65a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
          />
        </svg>
      </span>

      <input
        type="search"
        placeholder="Rechercher une catégorie ou une vidéo…"
        className="w-full bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />

      <select
        name="category"
        id="category"
        className="hidden h-full border-l border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none hover:bg-slate-50 sm:block"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="all">Tous</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.title}
          </option>
        ))}
      </select>

      <button 
        type="submit"
        className="m-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        Chercher
      </button>
    </form>
  )
}

export default SearchBar