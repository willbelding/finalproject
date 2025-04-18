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

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { email, password });
      alert('Signup successful! Please log in.');
      navigate('/');
    } catch (err) {
      alert('Signup failed. Email might be in use.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Signup</h2>
      <form onSubmit={handleSignup}>
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
        <button style={styles.button} type="submit">Signup</button>
      </form>
      <button style={{ ...styles.button, ...styles.secondary }} onClick={() => navigate('/')}>
        Back to Login
      </button>
    </div>
  );
};

export default Signup;