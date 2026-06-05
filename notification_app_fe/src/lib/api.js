const API_BASE = import.meta.env.VITE_API_BASE || '/api/evaluation-service'

const API_TOKEN = import.meta.env.VITE_API_TOKEN

export async function fetchNotifications({ page = 1, limit = 20, type = 'all' }) {
  if (!API_TOKEN) {
    throw new Error('Missing VITE_API_TOKEN in your environment.')
  }

  const typeMap = {
    event: 'Event',
    result: 'Result',
    placement: 'Placement',
  }
  const params = new URLSearchParams()
  if (limit) params.set('limit', String(limit))
  if (page) params.set('page', String(page))
  if (type && type !== 'all') {
    params.set('notification_type', typeMap[type] || type)
  }

  const base = API_BASE.replace(/\/$/, '')
  const url = `${base}/notifications?${params.toString()}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Notifications API failed (${response.status}).`)
  }

  const data = await response.json()
  return Array.isArray(data.notifications) ? data.notifications : []
}
