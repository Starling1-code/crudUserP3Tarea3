import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Login />
  }

  return <Dashboard />
}

export default App
