// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'

import Navigation from './components/Navigation'
import PageTransition from './components/PageTransition'
import Today from './pages/Today'
import Tasks from './pages/Tasks'
import Notes from './pages/Notes'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <Navigation />

          {/* yahi wrapper sab pages ke liye nav-safe area hai */}
          <main className="app-main">
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                }
              />
              <Route
                path="/signup"
                element={
                  <PageTransition>
                    <Signup />
                  </PageTransition>
                }
              />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      <Today />
                    </PageTransition>
                  }
                />
                <Route
                  path="/tasks"
                  element={
                    <PageTransition>
                      <Tasks />
                    </PageTransition>
                  }
                />
                <Route
                  path="/notes"
                  element={
                    <PageTransition>
                      <Notes />
                    </PageTransition>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PageTransition>
                      <Profile />
                    </PageTransition>
                  }
                />
              </Route>

              {/* Fallback */}
              <Route
                path="*"
                element={
                  <PageTransition>
                    <Today />
                  </PageTransition>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
