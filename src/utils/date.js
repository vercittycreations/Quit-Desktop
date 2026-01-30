export function getToday() {
  const date = new Date()
  return date.toISOString().split('T')[0]
}

export function getTodayFormatted() {
  const date = new Date()
  const options = { weekday: 'long', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

export function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00')
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

export function isToday(dateString) {
  return dateString === getToday()
}
