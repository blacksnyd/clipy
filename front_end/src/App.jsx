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
import Login from './components/auth/Login'
import { makeVideoCreatedHandler } from './utils/modal.utils'
import { makeSearchChangeHandler } from './utils/search.utils'

function App() {
  const [activeModal, setActiveModal] = useState(null)
  const [reloadTrigger, setReloadTrigger] = useState(0)
  const [searchCriteria, setSearchCriteria] = useState({
    searchTerm: '',
    categoryId: 'all'
  })

  const handleOpenModal = (modalName) => () => setActiveModal(modalName)
  const handleCloseModal = () => setActiveModal(null)
  const handleVideoCreated = makeVideoCreatedHandler(setReloadTrigger)
  const handleSearchChange = makeSearchChangeHandler(setSearchCriteria)

  const renderModalContent = () => {
    if (activeModal === 'login') return <Login onClose={handleCloseModal} />
    if (activeModal === 'register') return <Register onClose={handleCloseModal} />
    if (activeModal === 'create') {
      return <ModalCreate videoId={null} onClose={handleCloseModal} onVideoCreated={handleVideoCreated} />
    }
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header
        onOpenModal={handleOpenModal('create')}
        onSearchChange={handleSearchChange}
        onOpenRegister={handleOpenModal('register')}
        onOpenLogin={handleOpenModal('login')}
      />
      <main className="flex flex-1">
        <Routes>
          <Route path="/" element={<Homepage reloadTrigger={reloadTrigger} searchCriteria={searchCriteria} />} />
          <Route path="/video/:id" element={<DetailVideo />} />
        </Routes>
      </main>
      <Footer />

      {activeModal && (
        <ModalBase isOpen onClose={handleCloseModal}>
          {renderModalContent()}
        </ModalBase>
      )}
    </div>
  )
}

export default App
