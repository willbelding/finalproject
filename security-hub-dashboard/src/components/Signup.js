// This file is needed for the implementation of the sign up page on the dashboard.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// Same styles are used from the login page for consistency.
const styles = {
  container: { // Sign Up page container styling
    maxWidth: 400,
    margin: '80px auto',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  input: { // Sign Up input text box styling
    width: '100%',
    padding: '12px',
    margin: '12px 0',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 16
  },
  button: { // Sign up button styling
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

// This section is used for the Signup component logic.
const Signup = () => {
  // This forms a state for both the email and password.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // This then handles the sign up form submission from a user.
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // The sign up submission form is then sent to the backend
      await api.post('/auth/signup', { email, password });
      alert('Signup successful! You can now log in.');
      navigate('/'); // If successful, the user is taken to the previous page (login) 
    } catch (err) {
      // Otherwise, an error occurs (most commonly due to existing email in the DB)
      alert('Signup failed. Email might be in use.');
    }
  };

  // This returns all the styling that was set previously in the appropriate order.
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Signup</h2>
      <form onSubmit={handleSignup}>
        <input // This is where I declare my styling for email input.
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)} // Email provided is set
          required
        />
        <input // This is where I declare my styling for password input.
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)} // Password provided is set
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