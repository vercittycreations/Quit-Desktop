import React from 'react'
import './TaskItem.css'

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />
      <span className="task-text">{task.text}</span>
      <button
        className="task-delete"
        onClick={() => onDelete(task.id)}
        title="Delete"
      >
        ✕
      </button>
    </div>
  )
}
