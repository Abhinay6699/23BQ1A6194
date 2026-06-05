import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import NotificationCard from '../components/NotificationCard.jsx'
import { fetchNotifications } from '../lib/api.js'
import { computePriority } from '../lib/priority.js'
import { loadViewedIds, saveViewedIds } from '../lib/viewed.js'

const typeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Placement', value: 'placement' },
  { label: 'Result', value: 'result' },
  { label: 'Event', value: 'event' },
]

function PriorityInbox() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [typeFilter, setTypeFilter] = useState('all')
  const [fetchLimit, setFetchLimit] = useState(10)
  const [topCount, setTopCount] = useState(10)
  const [reloadKey, setReloadKey] = useState(0)
  const [viewedIds, setViewedIds] = useState(() => loadViewedIds())

  useEffect(() => {
    let isActive = true
    setLoading(true)
    setError(null)

    fetchNotifications({ page: 1, limit: fetchLimit, type: typeFilter })
      .then((data) => {
        if (!isActive) return
        setNotifications(data)
      })
      .catch((err) => {
        if (!isActive) return
        setError(err.message)
      })
      .finally(() => {
        if (!isActive) return
        setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [fetchLimit, typeFilter, reloadKey])

  const handleFetchLimit = (event) => {
    const value = Number(event.target.value)
    if (!Number.isNaN(value) && value > 0) {
      setFetchLimit(Math.min(10, value))
    }
  }

  const handleTopCount = (event) => {
    const value = Number(event.target.value)
    if (!Number.isNaN(value) && value > 0) {
      setTopCount(value)
    }
  }

  const markViewed = (id) => {
    const next = new Set(viewedIds)
    next.add(id)
    setViewedIds(next)
    saveViewedIds(next)
  }

  const prioritized = useMemo(
    () => computePriority(notifications, topCount, viewedIds),
    [notifications, topCount, viewedIds]
  )

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Priority Inbox
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Shows the top unread notifications based on type weight and recency.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="priority-type-label">Type</InputLabel>
          <Select
            labelId="priority-type-label"
            value={typeFilter}
            label="Type"
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            {typeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Fetch limit"
          type="number"
          size="small"
          value={fetchLimit}
          onChange={handleFetchLimit}
          inputProps={{ min: 1, max: 10 }}
          sx={{ maxWidth: 150 }}
        />

        <TextField
          label="Top N"
          type="number"
          size="small"
          value={topCount}
          onChange={handleTopCount}
          inputProps={{ min: 1, max: 10 }}
          sx={{ maxWidth: 120 }}
        />

        <Button
          variant="contained"
          onClick={() => setReloadKey((prev) => prev + 1)}
        >
          Refresh
        </Button>
      </Stack>

      <Divider />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && prioritized.length === 0 && (
        <Alert severity="info">No unread priority notifications.</Alert>
      )}

      <Stack spacing={2}>
        {prioritized.map(({ notification, weight }) => (
          <NotificationCard
            key={notification.ID}
            notification={notification}
            isViewed={viewedIds.has(notification.ID)}
            onMarkViewed={markViewed}
            weight={weight}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default PriorityInbox
