// This file is responsible for managing the general components of the dashboard.
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DeviceCard from './DeviceCard';
import { Box, AppBar, Toolbar, Typography, Button, Container, Grid, } from '@mui/material';
import { ThemeModeContext } from '../context/ThemeContext'; // This is used for my dark mode functionality

// After the user logs in, the dashboard component is set as the main page.
const Dashboard = ({ setIsAuthenticated }) => {
  // Lists all the devices with an account on the dashboard
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();
  // GET the JWT token from the browser storage (for the API requests).
  const token = localStorage.getItem('token');
  // Theme toggle for light and dark mode.
  const { toggleTheme, mode } = useContext(ThemeModeContext);

  // When the user log outs of their account, they are redirected back
  // to the previous page (login).
  const logout = () => {
    localStorage.removeItem('token'); // token is removed
    localStorage.removeItem('loginTime');
    localStorage.removeItem('tokenExpiry');
    setIsAuthenticated(false);
    navigate('/');
  };

  // All the devices associated with the current account are fetched.
  const fetchDevices = async () => {
    try {
      const res = await api.get('/device/list', {
        headers: { 'x-access-token': token }
      });
      setDevices(res.data);
    } catch (err) {
      // If the token has expired, the user is logged out.
      if (err.response?.status === 403) {
        // Message detailing the action.
        alert('Session has expired. If you wish to continue, please log in again.');
        logout();
      } else {
        alert('Failed to fetch devices.');
      }
    }
  };

  // When the component mounts, load the devices.
  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* The Top Navigation */}
      <AppBar position="static" sx={{ bgcolor: mode === 'dark' ? '#000' : undefined }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
            HomeGuard Security Dashboard
          </Typography>
          <Button color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* The Main content area */}
      <Container sx={{ py: 4 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Registered Devices
          </Typography>
          <Grid container spacing={2}>
            {devices.map(device => (
              <Grid item xs={12} sm={6} key={device.id}>
                <DeviceCard device={device} refresh={fetchDevices} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Container>

      {/* The bottom of the page */}
      <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} HomeGuard Security. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};
export default Dashboard;