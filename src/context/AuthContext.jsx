// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 🔥 STEP 4.4 — Firestore profile auto-create
        const userRef = doc(db, 'users', currentUser.uid)
        const snap = await getDoc(userRef)

        if (!snap.exists()) {
          await setDoc(userRef, {
            profile: {
              name: currentUser.email.split('@')[0],
              email: currentUser.email,
              avatar: null,
              createdAt: new Date()
            }
          })
        }

        setUser(currentUser)
      } else {
        setUser(null)
      }

      setInitializing(false)
    })

    return unsubscribe
  }, [])

  const signup = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  const value = {
    user,
    signup,
    login,
    logout,
    initializing,
  }

  if (initializing) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
