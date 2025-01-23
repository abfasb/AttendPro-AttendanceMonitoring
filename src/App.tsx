import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegistrationPage from './pages/RegistrationPage'
import LoginPage from './pages/RegistrationPage'

function App() {

  return (
    <Router>
      <Routes>

        <Route path='/register' element={<RegistrationPage />}/>
        <Route path='/login' element={<LoginPage />}/>
      </Routes>
    </Router>
  )
}

export default App
