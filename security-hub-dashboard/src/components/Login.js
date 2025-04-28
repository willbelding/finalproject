// This file is needed for the implementation of the login page on the dashboard.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// CSS in JavaScript styles are set for the login form UI.
const styles = {
  container: { // The login container box styling
    maxWidth: 400,
    margin: '80px auto',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  
  input: { // The text input box styling 
    width: '100%',
    padding: '12px',
    margin: '12px 0',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16
  },
  
  button: { // The login button styling
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

// This is the login page component logic.
const Login = ({ setIsAuthenticated }) => {
  // Forms a state for both email and password.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // This handles the submission of the provided login form.
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Authenticate details with the backend.
      const res = await api.post('/auth/signin', { email, password });
      // This stores the JWT token and login session times
      localStorage.setItem('token', res.data.accessToken);
      const now = new Date().getTime();
      localStorage.setItem('loginTime', now.toString());
      // If the user is inactive for more than 5 minutes, there are logged out
      // of their account.
      localStorage.setItem('tokenExpiry', (now + 5 * 60 * 1000).toString());
      setIsAuthenticated(true);
      navigate('/dashboard'); // If successful, navigate to the dashboard homepage.
    } catch (err) {
      // If an error is found, display the following error messages.
      console.error('Login error:', err.response?.data || err.message);
      alert('Login failed! Check whether the provided email and/or password are correct.');
    }
  };

  // Then the styles set at the beginning are utlised and ordered correctly.
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleLogin}>
        <input // This is where I declare the style for email input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)} // Email is set
          required
        />
        <input // This is where I declare my style for password input
          style={styles.input} 
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)} // Password is set
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