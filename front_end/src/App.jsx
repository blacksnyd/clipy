import './App.css'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import DetailVideo from './pages/DetailVideo'
import Homepage from './pages/Homepage'
import ModalCreate from './components/ModalCreate'
import ModalBase from './components/ModalBase'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)
  const [searchCriteria, setSearchCriteria] = useState({
    searchTerm: '',
    categoryId: 'all'
  })

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleVideoCreated = () => {
    // Déclencher le rechargement des vidéos
    setReloadTrigger(prev => prev + 1)
  }

  const handleSearchChange = (criteria) => {
    setSearchCriteria(criteria)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header onOpenModal={handleOpenModal} onSearchChange={handleSearchChange} />
      <main className="flex flex-1">
        <Routes>
          <Route path="/" element={<Homepage reloadTrigger={reloadTrigger} searchCriteria={searchCriteria} />} />
          <Route path="/video/:id" element={<DetailVideo />} />
        </Routes>
      </main>
      <Footer />

      <ModalBase isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalCreate videoId={null} onClose={handleCloseModal} onVideoCreated={handleVideoCreated} />
      </ModalBase>
    </div>
  )
}

export default App
