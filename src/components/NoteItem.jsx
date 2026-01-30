import React, { useState } from 'react'
import './NoteItem.css'

export default function NoteItem({ note, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)

  const handleSave = () => {
    onUpdate(note.id, title, content)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="note-item editing">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="note-title-input"
          placeholder="Note title..."
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="note-content-input"
          placeholder="Write your thoughts..."
        />
        <div className="note-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="note-item">
      <h3 className="note-title">{title}</h3>
      <p className="note-preview">{content.substring(0, 100)}...</p>
      <div className="note-footer">
        <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}
