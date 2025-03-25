import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box
} from '@mui/material';
import api from '../api';

const AddDevice = ({ onDeviceAdded }) => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const token = localStorage.getItem('token');

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/device/register', {
        deviceName,
        deviceType
      }, {
        headers: { 'x-access-token': token }
      });
      alert('Device registered!');
      setDeviceName('');
      setDeviceType('');
      onDeviceAdded();
    } catch (err) {
      alert('Failed to add device.');
    }
  };

  return (
    <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Device Name"
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
        required
      />
      <TextField
        label="Device Type"
        value={deviceType}
        onChange={(e) => setDeviceType(e.target.value)}
        required
      />
      <Button variant="contained" type="submit">Add Device</Button>
    </Box>
  );
};

export default AddDevice;