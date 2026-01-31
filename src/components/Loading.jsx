import './Loading.css'

export default function Loading({ text = 'Loading…' }) {
  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-spinner" />
        <p>{text}</p>
      </div>
    </div>
  )
}
