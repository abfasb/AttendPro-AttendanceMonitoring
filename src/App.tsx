import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegistrationPage from './pages/RegistrationPage'
import LoginPage from './pages/LoginPage'
import InstructorPage from './pages/Instructor/InstructorPage'
import StudentPage from './pages/Student/StudentPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LandingPage from './components/ui/LandingPage'

function App() {

    const isAuthenticated = !!localStorage.getItem("user");

  return (
    <Router>
      <Routes>

    {/*Landing Page */}
      <Route path='/' element={<LandingPage />}/>

        <Route path='/register' element={<RegistrationPage />}/>
        <Route path='/login' element={<LoginPage />}/>


        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
              <Route path='/my-account/instructor/' element={<InstructorPage />}/>
              <Route path='/my-account/student' element={<StudentPage />}/>
        </Route>
        
      </Routes>
    </Router>
  )
}

export default App
