// src/pages/Login.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import './Login.css'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  // ✅ already logged-in user redirect
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      await login(email.trim(), password)
    } catch (err) {
      let msg = 'Failed to log in.'
      if (err.code === 'auth/invalid-email') msg = 'Invalid email address.'
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Email or password is incorrect.'
      }
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // 🔥 Google Auth
  const handleGoogleLogin = async () => {
    setError('')
    setMessage('')
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      // redirect handled by useEffect
    } catch (err) {
      setError('Google sign-in failed.')
    }
  }

  // 🔁 Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email first.')
      return
    }

    setError('')
    setMessage('')
    setResetLoading(true)

    try {
      await sendPasswordResetEmail(auth, email.trim())
      setMessage('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError('Failed to send reset email.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue to your workspace.</p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        {/* 🔥 Google Login */}
        <button
          type="button"
          className="btn btn-secondary auth-google-btn"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <div className="auth-divider">or</div>

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

        {/* 🔁 Forgot password */}
        <button
          type="button"
          className="auth-forgot"
          onClick={handleForgotPassword}
          disabled={resetLoading}
        >
          {resetLoading ? 'Sending reset link…' : 'Forgot password?'}
        </button>

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
