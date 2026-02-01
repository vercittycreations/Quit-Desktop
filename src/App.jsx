import React from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
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
import Landing from './pages/Landing'

/* 🔥 APP LAYOUT (NAV + CONTENT) */
function AppLayout() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* LANDING */}
          <Route path="/" element={<Landing />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔐 PROTECTED APP */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppLayout />}>
              <Route
                index
                element={
                  <PageTransition>
                    <Today />
                  </PageTransition>
                }
              />
              <Route
                path="tasks"
                element={
                  <PageTransition>
                    <Tasks />
                  </PageTransition>
                }
              />
              <Route
                path="notes"
                element={
                  <PageTransition>
                    <Notes />
                  </PageTransition>
                }
              />
              <Route
                path="profile"
                element={
                  <PageTransition>
                    <Profile />
                  </PageTransition>
                }
              />
            </Route>
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
