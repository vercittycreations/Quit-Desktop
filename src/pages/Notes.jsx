import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Plus, Search, Trash2, Edit2, Tag, Clock } from 'lucide-react'
import './Notes.css'

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

export default function Notes() {
  const { user } = useAuth()

  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [editingId, setEditingId] = useState(null)

  const TAGS = ['Work', 'Personal', 'Ideas', 'Important']

  /* ---------------- LOAD NOTES (USER WISE) ---------------- */
  useEffect(() => {
    if (!user) {
      setNotes([])
      return
    }

    const q = query(
      collection(db, 'users', user.uid, 'notes'),
      orderBy('updatedAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }))
      setNotes(list)
    })

    return unsubscribe
  }, [user])

  /* ---------------- SAVE / UPDATE ---------------- */
  const handleSaveNote = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !user) return

    if (editingId) {
      await updateDoc(
        doc(db, 'users', user.uid, 'notes', editingId),
        {
          title,
          content,
          tag: selectedTag,
          updatedAt: new Date()
        }
      )
      setEditingId(null)
    } else {
      await addDoc(
        collection(db, 'users', user.uid, 'notes'),
        {
          title,
          content,
          tag: selectedTag,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      )
    }

    setTitle('')
    setContent('')
    setSelectedTag('all')
  }

  /* ---------------- DELETE ---------------- */
  const handleDeleteNote = async (id) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'notes', id))
  }

  /* ---------------- EDIT ---------------- */
  const handleEditNote = (note) => {
    setTitle(note.title)
    setContent(note.content)
    setSelectedTag(note.tag)
    setEditingId(note.id)
  }

  /* ---------------- FILTER ---------------- */
  const getFilteredNotes = () => {
    return notes
      .filter(n => {
        const matchesSearch =
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesTag =
          selectedTag === 'all' || n.tag === selectedTag

        return matchesSearch && matchesTag
      })
      .sort((a, b) => {
        const aDate = a.updatedAt?.toDate?.() || new Date(a.updatedAt)
        const bDate = b.updatedAt?.toDate?.() || new Date(b.updatedAt)
        return bDate - aDate
      })
  }

  const filteredNotes = getFilteredNotes()

  return (
    <div className="page notes-page">
      <Header
        title="Notes"
        subtitle={`${notes.length} note${notes.length !== 1 ? 's' : ''} saved`}
      />

      {/* Create Note Form */}
      <div className="note-form-section">
        <form onSubmit={handleSaveNote} className="note-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="note-title-input"
            required
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            className="note-content-textarea"
            rows="5"
            required
          />

          <div className="form-footer">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="note-tag-select"
            >
              <option value="all">Select tag...</option>
              {TAGS.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <button type="submit" className="btn btn-primary">
              <Plus size={20} />
              {editingId ? 'Update' : 'Save'} Note
            </button>
          </div>
        </form>
      </div>

      {/* Search and Filter */}
      {notes.length > 0 && (
        <div className="notes-controls">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="tag-filters">
            <button
              className={`tag-btn ${selectedTag === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTag('all')}
            >
              All
            </button>
            {TAGS.map(tag => (
              <button
                key={tag}
                className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="notes-container">
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No notes yet</h3>
            <p>{searchQuery ? 'Try a different search' : 'Create your first note above'}</p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map(note => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3>{note.title}</h3>
                  <div className="note-actions">
                    <button
                      className="note-action-btn edit"
                      onClick={() => handleEditNote(note)}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="note-action-btn delete"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="note-content">
                  {note.content.substring(0, 150)}...
                </p>

                <div className="note-footer">
                  <span className="note-tag">
                    <Tag size={14} /> {note.tag}
                  </span>
                  <span className="note-date">
                    <Clock size={14} />
                    {(note.updatedAt?.toDate
                      ? note.updatedAt.toDate()
                      : new Date(note.updatedAt)
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
