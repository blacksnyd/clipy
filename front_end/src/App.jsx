import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'

function App() {

  return (
    <>
      <Header />
      <Routes>
        {/* <Route path="/" element={<Homepage />} />
        <Route path="/video/:id" element={<VideoPage />} /> */}
      </Routes>
    </>
  )
}

export default App
