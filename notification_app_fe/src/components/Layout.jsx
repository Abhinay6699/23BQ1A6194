import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'

const tabs = [
  { label: 'All Notifications', path: '/all' },
  { label: 'Priority Inbox', path: '/priority' },
]

function Layout({ children }) {
  const location = useLocation()
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.path === location.pathname)
  )

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(15, 61, 62, 0.08)' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 2, gap: 3, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Campus Notifications
            </Typography>
            <Tabs
              value={activeIndex}
              textColor="primary"
              indicatorColor="primary"
              sx={{ ml: 'auto', minHeight: 48 }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.path}
                  label={tab.label}
                  component={Link}
                  to={tab.path}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
              ))}
            </Tabs>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
