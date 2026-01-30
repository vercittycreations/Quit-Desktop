import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

export default function Navigation() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { path: '/', label: 'Today' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/notes', label: 'Notes' },
    { path: '/profile', label: 'Profile' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navigation">
      <div className="nav-header">
        <Link to="/" className="nav-brand">
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
