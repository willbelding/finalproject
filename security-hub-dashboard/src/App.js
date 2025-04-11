import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const inactivityTimeoutRef = useRef(null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('tokenExpiry');
    setIsAuthenticated(false);
  };

  const resetInactivityTimer = () => {
    const now = Date.now();
    localStorage.setItem('loginTime', now.toString());
    localStorage.setItem('tokenExpiry', (now + 5 * 60 * 1000).toString());
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      logout();
    }, 5 * 60 * 1000); 
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    const now = Date.now();

    if (token && expiry && now < parseInt(expiry, 10)) {
      setIsAuthenticated(true);
      resetInactivityTimer();
    } else {
      logout();
    }

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;