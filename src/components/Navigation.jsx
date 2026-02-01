import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

export default function Navigation() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { path: '/app', label: 'Today' },
    { path: '/app/tasks', label: 'Tasks' },
    { path: '/app/notes', label: 'Notes' },
    { path: '/app/profile', label: 'Profile' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navigation">
      <div className="nav-header">
        <Link to="/app" className="nav-brand">
          ◆
        </Link>
        <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        {links.map(link => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
