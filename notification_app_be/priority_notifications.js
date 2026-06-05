const API_URL = 'http://4.224.186.213/evaluation-service/notifications';
const MAX_RESULTS = 10;

function getWeight(type) {
  switch (String(type || '').toLowerCase()) {
    case 'placement':
      return 3;
    case 'result':
      return 2;
    case 'event':
      return 1;
    default:
      return 0;
  }
}

function getTimestampMs(timestamp) {
  const value = new Date(timestamp).getTime();
  return Number.isFinite(value) ? value : 0;
}

function isUnread(notification) {
  if (typeof notification === 'object' && notification !== null) {
    if (Object.prototype.hasOwnProperty.call(notification, 'isRead')) {
      return !notification.isRead;
    }
    if (Object.prototype.hasOwnProperty.call(notification, 'IsRead')) {
      return !notification.IsRead;
    }
    if (Object.prototype.hasOwnProperty.call(notification, 'read')) {
      return !notification.read;
    }
    if (Object.prototype.hasOwnProperty.call(notification, 'Read')) {
      return !notification.Read;
    }
  }
  return true;
}

function comparePriority(a, b) {
  if (a.weight !== b.weight) return a.weight - b.weight;
  return a.timestampMs - b.timestampMs;
}

class MinHeap {
  constructor() {
    this.items = [];
  }

  size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
  }

  push(item) {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  replaceTop(item) {
    this.items[0] = item;
    this.bubbleDown(0);
  }

  toSortedDesc() {
    return [...this.items].sort((a, b) => comparePriority(b, a));
  }

  bubbleUp(index) {
    let i = index;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (comparePriority(this.items[i], this.items[parent]) >= 0) break;
      [this.items[i], this.items[parent]] = [this.items[parent], this.items[i]];
      i = parent;
    }
  }

  bubbleDown(index) {
    let i = index;
    const length = this.items.length;
    while (true) {
      const left = i * 2 + 1;
      const right = i * 2 + 2;
      let smallest = i;

      if (left < length && comparePriority(this.items[left], this.items[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && comparePriority(this.items[right], this.items[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === i) break;
      [this.items[i], this.items[smallest]] = [this.items[smallest], this.items[i]];
      i = smallest;
    }
  }
}

async function fetchNotifications() {
  if (typeof fetch !== 'function') {
    throw new Error('This script requires Node.js 18+ (global fetch).');
  }

  const token = process.env.EVAL_TOKEN;
  if (!token) {
    throw new Error('Missing EVAL_TOKEN env var for Authorization header.');
  }

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Notifications API failed (${response.status}).`);
  }

  const data = await response.json();
  return Array.isArray(data.notifications) ? data.notifications : [];
}

function selectTopUnread(notifications, limit) {
  const heap = new MinHeap();

  for (const notification of notifications) {
    if (!isUnread(notification)) continue;

    const weight = getWeight(notification.Type);
    const timestampMs = getTimestampMs(notification.Timestamp);

    const item = {
      id: notification.ID,
      type: notification.Type,
      message: notification.Message,
      timestamp: notification.Timestamp,
      weight,
      timestampMs,
    };

    if (heap.size() < limit) {
      heap.push(item);
      continue;
    }

    if (comparePriority(item, heap.peek()) > 0) {
      heap.replaceTop(item);
    }
  }

  return heap.toSortedDesc();
}

async function main() {
  const notifications = await fetchNotifications();
  const topUnread = selectTopUnread(notifications, MAX_RESULTS);

  console.log(`Top ${MAX_RESULTS} priority unread notifications:`);
  console.table(topUnread.map(({ id, type, message, timestamp, weight }) => ({
    id,
    type,
    message,
    timestamp,
    weight,
  })));
}

main().catch((error) => {
  console.error('Failed to compute priority notifications:', error.message);
  process.exitCode = 1;
});
