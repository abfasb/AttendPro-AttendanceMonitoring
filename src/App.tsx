import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegistrationPage from './pages/RegistrationPage'
import LoginPage from './pages/LoginPage'
import InstructorPage from './pages/Instructor/InstructorPage'

function App() {

  return (
    <Router>
      <Routes>

        <Route path='/register' element={<RegistrationPage />}/>
        <Route path='/login' element={<LoginPage />}/>


        <Route path='/my-account/instructor' element={<InstructorPage />}/>
      </Routes>
    </Router>
  )
}

export default App
