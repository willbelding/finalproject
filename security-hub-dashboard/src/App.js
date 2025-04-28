// This file handles some user actions and token activities.
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  // This is a state to track whether the user is authenticated or not.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // This is used to track the inactivity timer that is used on the dashboard to ensure security.
  const inactivityTimeoutRef = useRef(null);

  // This completes actions when the user logs out. 
  const logout = () => {
    // clears token and related state.
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('tokenExpiry');
    setIsAuthenticated(false);
  };

  // Once the user starts the interact with the dashboard again, the inactvity timer is reset.
  const resetInactivityTimer = () => {
    const now = Date.now();
    localStorage.setItem('loginTime', now.toString());
    localStorage.setItem('tokenExpiry', (now + 5 * 60 * 1000).toString()); // expiry timer is set to 5 minutes
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      logout();
    }, 5 * 60 * 1000); // If the user is active, set timer back to 5 minutes.
  };

  // This is an effect that checks authentication and a setup to track inactivity.
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

    // This sets up listeners for user actions that will reset the inactivity timer.
    // In this case, I am monitoring mouse movements, key presses, scrolls, and clicks.
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // On unmount, perform a cleanup on the timer.
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  // This returns the authentication of login and signup.
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