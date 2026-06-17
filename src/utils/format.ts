import type { Season } from '../state/types'

export function formatMoney(n: number): string {
  const abs = Math.abs(n)
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return n < 0 ? `-$${formatted}` : `$${formatted}`
}

export function formatTime(units: number): string {
  // 100 units = 8:00 AM, 0 units = 10:00 PM (14 hours span)
  const totalMinutes = Math.round((1 - units / 100) * 14 * 60)
  const startHour = 8
  const hours = startHour + Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  const paddedMin = minutes.toString().padStart(2, '0')
  return `${displayHour}:${paddedMin} ${period}`
}

export function dayName(d: number): string {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const idx = Math.max(0, Math.min(6, d - 1))
  return days[idx]
}

export function seasonName(s: Season): string {
  const names: Record<Season, string> = {
    spring: 'Spring',
    summer: 'Summer',
    fall: 'Fall',
    winter: 'Winter',
  }
  return names[s]
}
