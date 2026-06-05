import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import AllNotifications from './pages/AllNotifications.jsx'
import PriorityInbox from './pages/PriorityInbox.jsx'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/all" replace />} />
        <Route path="/all" element={<AllNotifications />} />
        <Route path="/priority" element={<PriorityInbox />} />
        <Route path="*" element={<Navigate to="/all" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
