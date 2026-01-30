// src/pages/Login.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login, user } = useAuth()   // ✅ user added
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ✅ NEW: already logged-in user ko redirect
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email.trim(), password)
      // ❌ yahan navigate likhne ki zarurat nahi
      // AuthContext + useEffect handle karega
    } catch (err) {
      let message = 'Failed to log in.'
      if (err.code === 'auth/invalid-email') message = 'Invalid email address.'
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'Email or password is incorrect.'
      }
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue to your workspace.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary auth-button"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <p className="auth-footer">
          Need an account?{' '}
          <Link to="/signup" className="auth-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
