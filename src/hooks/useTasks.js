// src/hooks/useTasks.js
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
import { getToday } from '../utils/date'

export function useTasks() {
  const { user } = useAuth()

  // 🔥 USER BASED CACHE KEY
  const cacheKey = user ? `tasks_cache_${user.uid}` : null

  // ✅ STEP 1: load from cache first
  const [tasks, setTasks] = useState(() => {
    if (!cacheKey) return []
    const cached = localStorage.getItem(cacheKey)
    return cached ? JSON.parse(cached) : []
  })

  /* ---------------- FIRESTORE SYNC ---------------- */
  useEffect(() => {
    if (!user) {
      setTasks([]) // logout → memory clear
      return
    }

    const q = query(
      collection(db, 'users', user.uid, 'tasks'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setTasks(list)

      // 🔥 STEP 2: update cache after Firestore sync
      localStorage.setItem(cacheKey, JSON.stringify(list))
    })

    return unsubscribe
  }, [user])

  /* ---------------- ACTIONS ---------------- */

  const addTask = async (text, isDaily = false) => {
    if (!user) return

    await addDoc(collection(db, 'users', user.uid, 'tasks'), {
      text,
      completed: false,
      date: getToday(),
      isDaily,
      createdAt: new Date()
    })
  }

  const updateTask = async (id, updates) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'tasks', id), updates)
  }

  const deleteTask = async (id) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'tasks', id))
  }

  const toggleTask = async (id, completed) => {
    updateTask(id, { completed: !completed })
  }

  /* ---------------- HELPERS ---------------- */

  const getTodayTasks = () => {
    return tasks.filter(task => task.date === getToday())
  }

  const getAllTasks = () => {
    return tasks
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTodayTasks,
    getAllTasks
  }
}
