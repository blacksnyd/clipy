import './App.css'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import DetailVideo from './pages/DetailVideo'
import Homepage from './pages/Homepage'
import ModalCreate from './components/modals/ModalCreate'
import ModalBase from './components/modals/ModalBase'
import Register from './components/auth/Register'
import { makeCloseModalHandler, makeOpenModalHandler, makeVideoCreatedHandler } from './utils/modal.utils'
import { makeSearchChangeHandler } from './utils/search.utils'

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [reloadTrigger, setReloadTrigger] = useState(0)
  const [searchCriteria, setSearchCriteria] = useState({
    searchTerm: '',
    categoryId: 'all'
  })

  const handleOpenCreateModal = makeOpenModalHandler(setIsCreateModalOpen)
  const handleCloseCreateModal = makeCloseModalHandler(setIsCreateModalOpen)
  const handleOpenRegisterModal = makeOpenModalHandler(setIsRegisterModalOpen)
  const handleCloseRegisterModal = makeCloseModalHandler(setIsRegisterModalOpen)
  const handleVideoCreated = makeVideoCreatedHandler(setReloadTrigger)
  const handleSearchChange = makeSearchChangeHandler(setSearchCriteria)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header
        onOpenModal={handleOpenCreateModal}
        onSearchChange={handleSearchChange}
        onOpenRegister={handleOpenRegisterModal}
      />
      <main className="flex flex-1">
        <Routes>
          <Route path="/" element={<Homepage reloadTrigger={reloadTrigger} searchCriteria={searchCriteria} />} />
          <Route path="/video/:id" element={<DetailVideo />} />
        </Routes>
      </main>
      <Footer />

      <ModalBase isOpen={isRegisterModalOpen} onClose={handleCloseRegisterModal}>
        <Register onClose={handleCloseRegisterModal} />
      </ModalBase>

      <ModalBase isOpen={isCreateModalOpen} onClose={handleCloseCreateModal}>
        <ModalCreate videoId={null} onClose={handleCloseCreateModal} onVideoCreated={handleVideoCreated} />
      </ModalBase>
    </div>
  )
}

export default App
