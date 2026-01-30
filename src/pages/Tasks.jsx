import React, { useState } from 'react'
import Header from '../components/Header'
import TaskItem from '../components/TaskItem'
import { useTasks } from '../hooks/useTasks'
import { Plus, CheckCircle2, Circle, Zap, Calendar, Filter, Search } from 'lucide-react'
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
      tasks = tasks.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return tasks
  }

  const filteredTasks = getFilteredTasks()
  const progressPercentage = allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0

  return (
    <div className="page tasks-page">
      <Header
        title="Tasks"
        subtitle={`${completedCount} of ${allTasks.length} completed`}
      />

      {/* Progress Section */}
      {allTasks.length > 0 && (
        <div className="tasks-progress-section">
          <div className="progress-container">
            <div className="progress-info">
              <div className="progress-stat">
                <div className="stat-icon stat-active">
                  <Circle size={20} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Active</p>
                  <p className="stat-value">{activeTasks.length}</p>
                </div>
              </div>
              <div className="progress-stat">
                <div className="stat-icon stat-completed">
                  <CheckCircle2 size={20} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Completed</p>
                  <p className="stat-value">{completedCount}</p>
                </div>
              </div>
              <div className="progress-stat">
                <div className="stat-icon stat-total">
                  <Zap size={20} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total</p>
                  <p className="stat-value">{allTasks.length}</p>
                </div>
              </div>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar-labels">
                <span>Overall Progress</span>
                <span className="progress-percentage">{progressPercentage}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <div className="task-input-section">
        <form onSubmit={handleAddTask} className="add-task-form">
          <div className="form-input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new task..."
              className="add-task-input"
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-add-task">
              <Plus size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Search and Filter */}
      {allTasks.length > 0 && (
        <div className="tasks-controls">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              {filterStatus === 'completed' ? (
                <CheckCircle2 size={64} />
              ) : filterStatus === 'active' ? (
                <Circle size={64} />
              ) : (
                <Calendar size={64} />
              )}
            </div>
            <h3 className="empty-state-title">
              {searchQuery ? 'No matching tasks' : filterStatus === 'all' ? 'No tasks yet' : filterStatus === 'active' ? 'All tasks done!' : 'No completed tasks'}
            </h3>
            <p className="empty-state-text">
              {searchQuery ? 'Try a different search' : filterStatus === 'all' ? 'Create one to get started' : filterStatus === 'active' ? 'Great work! Keep it up!' : 'Complete some tasks first'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-item-wrapper">
              <TaskItem task={task} onToggle={toggleTask} onDelete={deleteTask} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
