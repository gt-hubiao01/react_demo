import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import EchartsDemo from '@/pages/EchartsDemo'
import TreeChartDemo from '@/pages/TreeChartDemo'
import ThreeJsDemo from './pages/ThreeJsDemo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/echarts" element={<EchartsDemo />} />
        <Route path="/treeChart" element={<TreeChartDemo />} />
        <Route path="/threejs" element={<ThreeJsDemo />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
