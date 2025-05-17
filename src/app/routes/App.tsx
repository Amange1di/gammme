import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import '../style/app.scss'
import { Balance, Woter } from '../../pages'

function App() {
  return (
    <BrowserRouter>
      <NavLink to="/">Balance</NavLink>
      <NavLink to="/woter">Woter</NavLink>
      <Routes>
        <Route path="/" element={<Balance />} />
        <Route path="/woter" element={<Woter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
