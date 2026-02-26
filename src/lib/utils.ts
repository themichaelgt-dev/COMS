import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}

export function formatEstimatedTime(smsCount: number): string {
  const totalSecs = smsCount * 4
  if (totalSecs < 60) return `~${totalSecs}s`
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  return secs > 0 ? `~${mins}m ${secs}s` : `~${mins}m`
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export const ALL_TAGS = ['mobile-branch', 'event-attendees', 'new-members', 'canvassers'] as const
export type Tag = typeof ALL_TAGS[number]

export const TAG_COLORS: Record<string, string> = {
  'mobile-branch': 'bg-blue-100 text-blue-700',
  'event-attendees': 'bg-purple-100 text-purple-700',
  'new-members': 'bg-green-100 text-green-700',
  'canvassers': 'bg-orange-100 text-orange-700',
}
