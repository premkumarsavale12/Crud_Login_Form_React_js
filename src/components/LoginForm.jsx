import React, { useState } from 'react'
import axios from 'axios'
import { decryptToObject } from '../utils/crypto'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Typography, Alert } from '@mui/material'

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const validate = () => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !re.test(email)) {
      setError('Please enter a valid email')
      return false
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const res = await axios.get('http://localhost:3001/students')
      const list = res.data
      for (const rec of list) {
        const student = decryptToObject(rec.encryptedData)
        if (!student) continue
        if (student.email === email && student.password === password) {
          onLogin && onLogin()
          navigate('/students')
          return
        }
      }
      setError('Invalid credentials')
    } catch (err) {
      console.error(err)
      setError('Server error. Make sure json-server is running on port 3001')
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, margin: 'auto', mt: 8, p: 4, border: '1px solid #ccc', borderRadius: 2 }}
    >
      <Typography variant="h5" gutterBottom>Login</Typography>

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Password"
        variant="outlined"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  )
}
