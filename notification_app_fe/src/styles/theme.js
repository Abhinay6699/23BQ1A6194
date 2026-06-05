import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f4b4c',
    },
    secondary: {
      main: '#c96b3f',
    },
    background: {
      default: '#f4f1ed',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", system-ui, sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: -0.4,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
})

export default theme
