import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DeviceCard from './DeviceCard';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
} from '@mui/material';
import { ThemeModeContext } from '../context/ThemeContext';

const Dashboard = ({ setIsAuthenticated }) => {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { toggleTheme, mode } = useContext(ThemeModeContext);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('tokenExpiry');
    setIsAuthenticated(false);
    navigate('/');
  };

  const fetchDevices = async () => {
    try {
      const res = await api.get('/device/list', {
        headers: { 'x-access-token': token }
      });
      setDevices(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Session expired. Please log in again.');
        logout();
      } else {
        alert('Failed to fetch devices.');
      }
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <AppBar position="static" sx={{ bgcolor: mode === 'dark' ? '#000' : undefined }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
            Security Hub Dashboard
          </Typography>
          <Button color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
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

      {/* Footer */}
      <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Security Hub. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;