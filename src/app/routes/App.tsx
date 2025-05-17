import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../style/app.scss'
import { Balance, Woter } from '../../pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Balance />} />
        <Route path="/woter" element={<Woter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
