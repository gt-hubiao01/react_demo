import { BrowserRouter, Route, Routes } from 'react-router-dom'
import route from './route'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {
          route.map((item) => (
            <Route key={item.path} path={item.path} element={item.component} />
          ))
        }
      </Routes>
    </BrowserRouter>
  )
}

export default App
