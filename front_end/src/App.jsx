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

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header onOpenModal={handleOpenModal} />
      <main className="flex flex-1">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/video/:id" element={<DetailVideo />} />
        </Routes>
      </main>
      <Footer />

      <ModalBase isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalCreate videoId={null} onClose={handleCloseModal} />
      </ModalBase>
    </div>
  )
}

export default App
