const WEIGHTS = {
  placement: 3,
  result: 2,
  event: 1,
}

function getWeight(type) {
  const key = String(type || '').toLowerCase()
  return WEIGHTS[key] || 0
}

function getTimestampMs(timestamp) {
  const value = new Date(timestamp).getTime()
  return Number.isFinite(value) ? value : 0
}

export function computePriority(notifications, limit, viewedIds) {
  const scored = notifications
    .filter((notification) => !viewedIds?.has(notification.ID))
    .map((notification) => ({
      notification,
      weight: getWeight(notification.Type),
      timestampMs: getTimestampMs(notification.Timestamp),
    }))
    .sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight
      return b.timestampMs - a.timestampMs
    })

  return scored.slice(0, limit)
}
