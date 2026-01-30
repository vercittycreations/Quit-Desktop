// src/hooks/useNotes.js
import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export function useNotes() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])

  /* ---------------- LOAD NOTES ---------------- */
  useEffect(() => {
    if (!user) {
      setNotes([]) // logout → clear notes
      return
    }

    const q = query(
      collection(db, 'users', user.uid, 'notes'),
      orderBy('updatedAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setNotes(list)
    })

    return unsubscribe
  }, [user])

  /* ---------------- ACTIONS ---------------- */

  const addNote = async (title, content) => {
    if (!user) return

    const now = new Date()

    await addDoc(collection(db, 'users', user.uid, 'notes'), {
      title,
      content,
      createdAt: now,
      updatedAt: now
    })
  }

  const updateNote = async (id, title, content) => {
    if (!user) return

    await updateDoc(
      doc(db, 'users', user.uid, 'notes', id),
      {
        title,
        content,
        updatedAt: new Date()
      }
    )
  }

  const deleteNote = async (id) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'notes', id))
  }

  const getNotes = () => {
    return notes
  }

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotes
  }
}
