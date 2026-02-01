import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import TaskItem from '../components/TaskItem'
import { useTasks } from '../hooks/useTasks'
import { 
  Plus, 
  Star, 
  Zap, 
  TrendingUp, 
  CheckCircle2,
  Lightbulb,
  Coffee,
  Moon,
  Sun,
  Quote,
  ArrowRight
} from 'lucide-react'
import './Today.css'

const DAILY_QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    icon: "💡"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    icon: "⏰"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
    icon: "🚀"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    icon: "💪"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    icon: "✨"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    icon: "🌱"
  },
  {
    text: "You don't have to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr.",
    icon: "🎯"
  },
  {
    text: "Everything you want is on the other side of fear.",
    author: "George Addair",
    icon: "🔥"
  }
]

export default function Today() {
  const { addTask, deleteTask, toggleTask, getTodayTasks } = useTasks()
  const [input, setInput] = useState('')
  const [todayQuote, setTodayQuote] = useState(null)
  const [greeting, setGreeting] = useState('')

  const todayTasks = getTodayTasks()
  const completedTasks = todayTasks.filter(t => t.completed)
  const activeTasks = todayTasks.filter(t => !t.completed)

  // Get daily quote based on date
  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
    const quoteIndex = dayOfYear % DAILY_QUOTES.length
    setTodayQuote(DAILY_QUOTES[quoteIndex])

    // Set greeting based on time
    const hour = today.getHours()
    if (hour < 12) {
      setGreeting('Good Morning! ☀️')
    } else if (hour < 18) {
      setGreeting('Good Afternoon! ☕')
    } else {
      setGreeting('Good Evening! 🌙')
    }
  }, [])

  const handleAddTask = (e) => {
    e.preventDefault()
    if (input.trim()) {
      addTask(input, true)
      setInput('')
    }
  }

  const completionPercentage = todayTasks.length > 0 
    ? Math.round((completedTasks.length / todayTasks.length) * 100) 
    : 0

  return (
    <div className="page today-page">
      <Header
        title="Today"
        subtitle="What matters most today?"
      />

      {/* Greeting Section */}
      <div className="greeting-section">
        <div className="greeting-card">
          <div className="greeting-icon">
            {greeting.includes('Morning') && <Sun size={40} />}
            {greeting.includes('Afternoon') && <Coffee size={40} />}
            {greeting.includes('Evening') && <Moon size={40} />}
          </div>
          <div className="greeting-content">
            <h2>{greeting}</h2>
            <p className="greeting-text">You have {activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''} to complete today</p>
          </div>
        </div>
      </div>

      {/* Daily Quote Section */}
      {todayQuote && (
        <div className="quote-section">
          <div className="quote-card">
            <div className="quote-top">
              <Quote size={32} className="quote-icon" />
              <span className="quote-emoji">{todayQuote.icon}</span>
            </div>
            <blockquote className="quote-text">
              {todayQuote.text}
            </blockquote>
            <footer className="quote-author">
              — {todayQuote.author}
            </footer>
            <div className="quote-indicator">
              <span className="quote-label">Today's Inspiration</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {todayTasks.length > 0 && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon active">
                <Zap size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Active</p>
                <p className="stat-number">{activeTasks.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon completed">
                <CheckCircle2 size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Completed</p>
                <p className="stat-number">{completedTasks.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon streak">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Progress</p>
                <p className="stat-number">{completionPercentage}%</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-wrapper">
            <div className="progress-bar-container">
              <div className="progress-info-bar">
                <span>Daily Progress</span>
                <span className="progress-text">{completedTasks.length}/{todayTasks.length}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <div className="task-input-section today-input">
        <form onSubmit={handleAddTask} className="add-task-form today-form">
          {/* UPDATED: helper class form-input-group add kiya responsive CSS ke liye */}
          <div className="form-wrapper form-input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Focus for today"
              className="add-task-input today-input-field"
              autoFocus
            />
            <button type="submit" className="btn btn-primary today-btn">
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tasks Section */}
      <div className="today-tasks-section">
        {todayTasks.length === 0 ? (
          <div className="empty-today-state">
            <div className="empty-icon">
              <Star size={64} />
            </div>
            <h3>No tasks for today</h3>
            <p>Add a task above to get started with your day!</p>
            <div className="empty-actions">
              <button onClick={() => document.querySelector('.today-input-field').focus()} className="btn btn-primary">
                <Plus size={18} />
                Add First Task
              </button>
            </div>
          </div>
        ) : (
          <div className="tasks-container">
            <h3 className="section-title">
              <Lightbulb size={20} />
              Today's Focus
            </h3>
            <div className="tasks-list">
              {todayTasks.map((task) => (
                <div key={task.id} className="task-wrapper">
                  <TaskItem
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Motivation Footer */}
      {todayTasks.length > 0 && completionPercentage === 100 && (
        <div className="celebration-section">
          <div className="celebration-card">
            <div className="celebration-emoji">🎉</div>
            <h3>Congratulations!</h3>
            <p>You've completed all your tasks for today. Amazing work!</p>
            <Link to="/tasks" className="btn btn-secondary">
              View All Tasks
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
