const DEFAULT_LOG_ENDPOINT = 'http://4.224.186.213/evaluation-service/logs'

export async function Log(stack, level, packageName, message) {
  const endpoint =
    (typeof process !== 'undefined' && process.env && process.env.LOG_ENDPOINT) ||
    DEFAULT_LOG_ENDPOINT
  const token =
    (typeof process !== 'undefined' && process.env && process.env.LOG_TOKEN) || ''

  const payload = {
    stack: String(stack).toLowerCase(),
    level: String(level).toLowerCase(),
    package: String(packageName).toLowerCase(),
    message,
  }

  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
}
