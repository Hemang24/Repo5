export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours()
  if (hour < 12) return `Good morning, ${name}`
  if (hour < 17) return `Good afternoon, ${name}`
  return `Good evening, ${name}`
}

export function getMoodEmoji(score: number): string {
  if (score <= 2) return '😔'
  if (score <= 4) return '😕'
  if (score <= 6) return '😐'
  if (score <= 8) return '🙂'
  return '😄'
}

export function getMoodLabel(score: number): string {
  if (score <= 2) return 'Rough'
  if (score <= 4) return 'Low'
  if (score <= 6) return 'Okay'
  if (score <= 8) return 'Good'
  return 'Great'
}
