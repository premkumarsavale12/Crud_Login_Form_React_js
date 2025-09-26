import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
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
          {!isAuth && (
            <>
              <Link to="/">Login</Link>{' | '}
              <Link to="/student/new">Register</Link>
            </>
          )}
          {isAuth && (
            <>
              <Link to="/students">Students</Link>{' | '}
              <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
            </>
          )}
        </nav>
      </header>

      <main style={{ marginTop: 16 }}>
        <div className="card">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              isAuth ? <Navigate to="/students" /> : <LoginForm onLogin={() => setIsAuth(true)} />
            } />
            <Route path="/student/new" element={
              isAuth ? <Navigate to="/students" /> : <StudentForm />
            } />

            {/* Protected Routes */}
            <Route path="/students" element={
              isAuth ? <StudentList /> : <Navigate to="/" />
            } />
            <Route path="/student/edit/:id" element={
              isAuth ? <StudentForm /> : <Navigate to="/" />
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
