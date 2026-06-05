const STORAGE_KEY = 'viewed_notifications'

export function loadViewedIds() {
  if (typeof window === 'undefined') {
    return new Set()
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = JSON.parse(raw || '[]')
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch (error) {
    return new Set()
  }
}

export function saveViewedIds(viewedIds) {
  if (typeof window === 'undefined') {
    return
  }

  const payload = Array.from(viewedIds)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
