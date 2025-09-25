import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { decryptToObject } from '../utils/crypto'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, Alert } from '@mui/material'
import Swal from 'sweetalert2'

export default function StudentList() {
  const [records, setRecords] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const load = async () => {
    try {
      const res = await axios.get('http://localhost:3001/students')
      const mapped = res.data.map(r => ({ id: r.id, student: decryptToObject(r.encryptedData) }))
      setRecords(mapped)
    } catch (err) {
      console.error(err)
      setError('Could not load students. Make sure json-server is running at http://localhost:3001')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/students/${id}`)
        setRecords(prev => prev.filter(p => p.id !== id))
        Swal.fire('Deleted!', 'Student has been deleted.', 'success')
      } catch (err) {
        console.error(err)
        Swal.fire('Error!', 'Delete failed', 'error')
      }
    }
  }

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Students</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.student?.fullName}</TableCell>
              <TableCell>{r.student?.email}</TableCell>
              <TableCell>{r.student?.phone}</TableCell>
              <TableCell>{r.student?.course}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="primary" onClick={() => navigate(`/student/edit/${r.id}`)}>Edit</Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(r.id)}>Delete</Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
