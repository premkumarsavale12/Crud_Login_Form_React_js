import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import StudentForm from './components/StudentForm'
import StudentList from './components/StudentList'

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const navigate = useNavigate()

  const logout = () => {
    setIsAuth(false)
    navigate('/')
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Student Management (Encrypted storage demo)</h2>
        <nav>
          <Link to="/">Login</Link>{' | '}
          <Link to="/students">Students</Link>{' | '}
          <Link to="/student/new">Register</Link>
          {isAuth && (<button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>)}
        </nav>
      </header>

      <main style={{ marginTop: 16 }}>
        <div className="card">
          <Routes>
            <Route path="/" element={<LoginForm onLogin={() => setIsAuth(true)} />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/student/new" element={<StudentForm />} />
            <Route path="/student/edit/:id" element={<StudentForm />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
