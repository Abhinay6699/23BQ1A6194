import { useEffect, useState } from 'react'
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
import { loadViewedIds, saveViewedIds } from '../lib/viewed.js'

const typeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Placement', value: 'placement' },
  { label: 'Result', value: 'result' },
  { label: 'Event', value: 'event' },
]

function AllNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [reloadKey, setReloadKey] = useState(0)
  const [viewedIds, setViewedIds] = useState(() => loadViewedIds())

  useEffect(() => {
    let isActive = true
    setLoading(true)
    setError(null)

    fetchNotifications({ page, limit, type: typeFilter })
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
  }, [page, limit, typeFilter, reloadKey])

  const handleLimitChange = (event) => {
    const value = Number(event.target.value)
    if (!Number.isNaN(value) && value > 0) {
      setLimit(Math.min(10, value))
      setPage(1)
    }
  }

  const markViewed = (id) => {
    const next = new Set(viewedIds)
    next.add(id)
    setViewedIds(next)
    saveViewedIds(next)
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          All Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse every notification with filters for type, page, and size.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="type-filter-label">Type</InputLabel>
          <Select
            labelId="type-filter-label"
            value={typeFilter}
            label="Type"
            onChange={(event) => {
              setTypeFilter(event.target.value)
              setPage(1)
            }}
          >
            {typeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Page size"
          type="number"
          size="small"
          value={limit}
          onChange={handleLimitChange}
          inputProps={{ min: 1, max: 10 }}
          sx={{ maxWidth: 140 }}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <Typography variant="body2">Page {page}</Typography>
          <Button variant="outlined" onClick={() => setPage((prev) => prev + 1)}>
            Next
          </Button>
        </Stack>

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

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      <Stack spacing={2}>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.ID}
            notification={notification}
            isViewed={viewedIds.has(notification.ID)}
            onMarkViewed={markViewed}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default AllNotifications
