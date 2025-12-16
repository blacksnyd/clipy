import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import DetailVideo from './components/DetailVideo'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<DetailVideo />} />
        {/* <Route path="/" element={<Homepage />} />
        <Route path="/video/:id" element={<VideoPage />} /> */}
      </Routes>
      <Footer />
    </>
  )
}

export default App
