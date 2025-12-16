import './App.css'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Modal from './components/Modal'
import DetailVideo from './pages/DetailVideo'
import Homepage from './pages/Homepage'

const videoSamples = [
  {
    id: 1,
    title: 'Exploration des montagnes',
    description: 'Une aventure immersive en haute altitude.',
    thumbnail: 'https://via.placeholder.com/600x338?text=Montagnes',
    averageRating: 4.5,
    ratingCount: 128
  },
  {
    id: 2,
    title: 'Recette : Pasta Verde',
    description: 'Pâtes fraîches et pesto maison.',
    thumbnail: 'https://via.placeholder.com/600x338?text=Pasta',
    averageRating: 4.2,
    ratingCount: 76
  },
  {
    id: 3,
    title: 'Tutoriel React',
    description: 'Hooks, routing et bonnes pratiques.',
    thumbnail: 'https://via.placeholder.com/600x338?text=React+Guide',
    averageRating: 4.8,
    ratingCount: 201
  },
  {
    id: 4,
    title: 'Voyage à Kyoto',
    description: 'Temples, jardins et gastronomie.',
    thumbnail: 'https://via.placeholder.com/600x338?text=Kyoto',
    averageRating: 4.6,
    ratingCount: 95
  }
]

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Header onOpenModal={handleOpenModal} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Homepage videos={videoSamples} />} />
          <Route path="/video/:id" element={<DetailVideo />} />
        </Routes>
      </main>
      <Footer />
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative mx-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Modal videoId={null} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </>
  )
}

export default App
