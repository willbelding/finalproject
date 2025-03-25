import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button
} from '@mui/material';

const DeviceCard = ({ device, refresh }) => {
  const token = localStorage.getItem('token');

  const updateStatus = async (newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/device/update/${device.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });
      refresh();
    } catch (err) {
      alert('Failed to update device status.');
    }
  };

  const statusColor = {
    Healthy: 'success.main',
    Warning: 'warning.main',
    Critical: 'error.main'
  };

  return (
    <Card sx={{ backgroundColor: statusColor[device.status] || 'grey.100' }}>
      <CardContent>
        <Typography variant="h6">{device.deviceName}</Typography>
        <Typography variant="subtitle1">Type: {device.deviceType}</Typography>
        <Typography variant="subtitle2">Status: {device.status}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => updateStatus('Healthy')}>Mark Healthy</Button>
        <Button size="small" onClick={() => updateStatus('Warning')}>Mark Warning</Button>
        <Button size="small" onClick={() => updateStatus('Critical')}>Mark Critical</Button>
      </CardActions>
    </Card>
  );
};

export default DeviceCard;