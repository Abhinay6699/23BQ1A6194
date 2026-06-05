import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material'

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'Unknown time'
  return date.toLocaleString()
}

function NotificationCard({ notification, isViewed, onMarkViewed, weight }) {
  const typeLabel = String(notification.Type || 'Unknown')

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: isViewed ? 'rgba(31, 75, 76, 0.2)' : 'primary.main',
        boxShadow: isViewed ? 'none' : '0 10px 24px rgba(31, 75, 76, 0.12)',
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={typeLabel} color="secondary" size="small" />
            <Chip
              label={isViewed ? 'Viewed' : 'New'}
              color={isViewed ? 'default' : 'primary'}
              size="small"
              variant={isViewed ? 'outlined' : 'filled'}
            />
            {typeof weight === 'number' && (
              <Chip label={`Weight ${weight}`} size="small" />
            )}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {notification.Message}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {notification.ID}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatTimestamp(notification.Timestamp)}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => onMarkViewed(notification.ID)}
            disabled={isViewed}
            sx={{ alignSelf: 'flex-start' }}
          >
            {isViewed ? 'Marked as Read' : 'Mark as Read'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    ID: PropTypes.string,
    Message: PropTypes.string,
    Timestamp: PropTypes.string,
    Type: PropTypes.string,
  }).isRequired,
  isViewed: PropTypes.bool.isRequired,
  onMarkViewed: PropTypes.func.isRequired,
  weight: PropTypes.number,
}

NotificationCard.defaultProps = {
  weight: undefined,
}

export default NotificationCard
