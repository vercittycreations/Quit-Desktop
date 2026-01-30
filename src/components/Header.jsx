import React from 'react'
import './Header.css'
export default function Header({ title, subtitle }) {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </div>
  )
}
