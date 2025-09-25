import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { encryptObject, decryptToObject } from '../utils/crypto'
import { useNavigate, useParams } from 'react-router-dom'
import { TextField, Button, Box, Typography, MenuItem, Alert } from '@mui/material'
import Swal from 'sweetalert2'

const empty = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  gender: 'Male',
  address: '',
  course: '',
  password: ''
}

export default function StudentForm() {
  const [data, setData] = useState(empty)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) fetchStudent(id)
  }, [id])

  const fetchStudent = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/students/${id}`)
      if (!res.data || !res.data.encryptedData) {
        setError('Student not found')
        return
      }
      const dec = decryptToObject(res.data.encryptedData)
      if (!dec) {
        setError('Could not decrypt student data')
        return
      }
      setData(dec) // populate form
    } catch (err) {
      console.error(err)
      setError('Could not load student')
    }
  }

  const validate = () => {
    if (!data.fullName) return 'Full name required'
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(data.email)) return 'Valid email required'
    if (!data.phone || data.phone.length < 7) return 'Valid phone required'
    if (!data.password || data.password.length < 6) return 'Password must be at least 6 chars'
    return null
  }

  const handleSave = async (e) => {
    e && e.preventDefault()
    const v = validate()
    if (v) return setError(v)
    setError(null)

    const encrypted = encryptObject(data)

    try {
      if (id) {
        await axios.put(`http://localhost:3001/students/${id}`, { encryptedData: encrypted })
        Swal.fire({ icon: 'success', title: 'Updated!', text: 'Student updated successfully', timer: 2000, showConfirmButton: false })
      } else {
        await axios.post('http://localhost:3001/students', { encryptedData: encrypted })
        Swal.fire({ icon: 'success', title: 'Created!', text: 'Student created successfully', timer: 2000, showConfirmButton: false })
      }
      navigate('/students')
    } catch (err) {
      console.error(err)
      Swal.fire({ icon: 'error', title: 'Error!', text: 'Server error. Make sure json-server is running on port 3001' })
    }
  }

  const handleChange = (k, v) => setData(prev => ({ ...prev, [k]: v }))

  return (
    <Box component="form" onSubmit={handleSave} sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 4, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>{id ? 'Edit Student' : 'Register Student'}</Typography>

      <TextField label="Full Name" fullWidth margin="normal" value={data.fullName} onChange={e => handleChange('fullName', e.target.value)} />
      <TextField label="Email" fullWidth margin="normal" value={data.email} onChange={e => handleChange('email', e.target.value)} />
      <TextField label="Phone" fullWidth margin="normal" value={data.phone} onChange={e => handleChange('phone', e.target.value)} />
      <TextField label="Date of Birth" type="date" fullWidth margin="normal" value={data.dob} InputLabelProps={{ shrink: true }} onChange={e => handleChange('dob', e.target.value)} />

      {/* Fixed Gender Dropdown */}
      <TextField
        select
        label="Gender"
        fullWidth
        margin="normal"
        value={data.gender}
        onChange={e => handleChange('gender', e.target.value)}
      >
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </TextField>

      <TextField label="Address" fullWidth multiline rows={3} margin="normal" value={data.address} onChange={e => handleChange('address', e.target.value)} />
      <TextField label="Course Enrolled" fullWidth margin="normal" value={data.course} onChange={e => handleChange('course', e.target.value)} />
      <TextField label="Password" type="password" fullWidth margin="normal" value={data.password} onChange={e => handleChange('password', e.target.value)} />

      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">{id ? 'Update' : 'Save'}</Button>
        <Button type="button" variant="outlined" onClick={() => navigate('/students')}>Cancel</Button>
      </Box>
    </Box>
  )
}
