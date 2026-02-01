import React, { useState } from 'react'
import Header from '../components/Header'
import TaskItem from '../components/TaskItem'
import { useTasks } from '../hooks/useTasks'
import {
  Plus,
  CheckCircle2,
  Circle,
  Zap,
  Calendar,
  Filter,
  Search
} from 'lucide-react'
import './Tasks.css'

export default function Tasks() {
  const { addTask, deleteTask, toggleTask, getAllTasks } = useTasks()
  const [input, setInput] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const allTasks = getAllTasks()

  const handleAddTask = (e) => {
    e.preventDefault()
    if (input.trim()) {
      addTask(input, false)
      setInput('')
    }
  }

  const completedCount = allTasks.filter(t => t.completed).length
  const activeTasks = allTasks.filter(t => !t.completed)
  const completedTasks = allTasks.filter(t => t.completed)

  const getFilteredTasks = () => {
    let tasks = allTasks

    switch (filterStatus) {
      case 'active':
        tasks = activeTasks
        break
      case 'completed':
        tasks = completedTasks
        break
      default:
        break
    }

    if (searchQuery.trim()) {
      tasks = tasks.filter(t =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return tasks
  }

  const filteredTasks = getFilteredTasks()

  const progressPercentage =
    allTasks.length > 0
      ? Math.round((completedCount / allTasks.length) * 100)
      : 0

  return (
    <div className="page tasks-page">
      <Header
        title="Tasks"
        subtitle="Manage all your tasks in one place"
      />

      {/* Progress section */}
      <section className="tasks-progress-section">
        <div className="progress-container">
          <div className="progress-info">
            <div className="progress-stat">
              <div className="stat-icon stat-active">
                <Zap size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Active</span>
                <span className="stat-value">{activeTasks.length}</span>
              </div>
            </div>

            <div className="progress-stat">
              <div className="stat-icon stat-completed">
                <CheckCircle2 size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{completedCount}</span>
              </div>
            </div>

            <div className="progress-stat">
              <div className="stat-icon stat-total">
                <Calendar size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total</span>
                <span className="stat-value">{allTasks.length}</span>
              </div>
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar-labels">
              <span>Overall progress</span>
              <span className="progress-percentage">
                {progressPercentage}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Add task */}
      <section className="task-input-section">
        <form onSubmit={handleAddTask} className="add-task-form">
          <div className="form-input-group">
            <input
              type="text"
              className="add-task-input"
              placeholder="Add a new task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-add-task">
              <Plus size={18} />
              <span>Add task</span>
            </button>
          </div>
        </form>
      </section>

      {/* Search + filters */}
      <section className="tasks-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            type="button"
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Active
          </button>
          <button
            type="button"
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
        </div>
      </section>

      {/* Tasks list / empty state */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Circle size={40} />
          </div>
          <h3 className="empty-state-title">No tasks yet</h3>
          <p className="empty-state-text">
            {searchQuery
              ? 'Try a different search'
              : filterStatus === 'all'
              ? 'Create one to get started'
              : filterStatus === 'active'
              ? 'Great work! Keep it up!'
              : 'Complete some tasks first'}
          </p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <div key={task.id} className="task-item-wrapper">
              <TaskItem
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
