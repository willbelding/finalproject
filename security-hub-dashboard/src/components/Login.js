import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

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
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/signup')}>Go to Signup</button>
    </div>
  );
};

export default Login;