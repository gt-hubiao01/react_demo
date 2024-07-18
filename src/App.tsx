import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import EchartsDemo from '@/pages/EchartsDemo'
import TreeChartDemo from '@/pages/TreeChartDemo'
import ThreeJsDemo from './pages/ThreeJsDemo'
import TfjsDemo from './pages/TfjsDemo'
import Demo from './pages/Demo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/echarts" element={<EchartsDemo />} />
        <Route path="/treeChart" element={<TreeChartDemo />} />
        <Route path="/threejs" element={<ThreeJsDemo />} />
        <Route path="/tfjs" element={<TfjsDemo />} />
        <Route path="/demo/*" element={<Demo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
