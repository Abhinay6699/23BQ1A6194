import { useState, useEffect } from 'react'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Login failed');
      
      localStorage.setItem('token', result.token);
      setToken(result.token);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setData(null);
  };

  const fetchProtectedData = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/protected', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to fetch protected data');
      
      setData(result.message);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Question 3: Full Stack Auth</h1>
      
      {!token ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
          <h3>Login</h3>
          <input 
            type="text" 
            placeholder="Username (admin)" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password (password)" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit">Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <div>
          <h3>Welcome! You are logged in.</h3>
          <button onClick={fetchProtectedData} style={{ marginRight: '10px' }}>Fetch Protected Data</button>
          <button onClick={handleLogout}>Logout</button>
          
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          {data && (
            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
              <strong>Data: </strong> {data}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
