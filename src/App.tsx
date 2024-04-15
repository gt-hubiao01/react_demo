import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EchartsDemo from './pages/EchartsDemo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/echarts" element={<EchartsDemo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
