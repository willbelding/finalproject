import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const styles = {
  container: {
    maxWidth: 400,
    margin: '80px auto',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '12px 0',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007AFF',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 16
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  secondary: {
    marginTop: 10,
    backgroundColor: '#eee',
    color: '#333'
  }
};

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signin', { email, password });
      localStorage.setItem('token', res.data.accessToken);
      const now = new Date().getTime();
      localStorage.setItem('loginTime', now.toString());
      localStorage.setItem('tokenExpiry', (now + 5 * 60 * 1000).toString());
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      alert('Login failed! Please check your email and password.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">Login</button>
      </form>
      <button style={{ ...styles.button, ...styles.secondary }} onClick={() => navigate('/signup')}>
        Go to Signup
      </button>
    </div>
  );
};

export default Login;