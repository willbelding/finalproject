import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText
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
    Critical: 'error.main',
    'Scanned - Healthy': 'success.light',
    'Scanned - Issues Found': 'error.light'
  };

  const scanData = device.scanReport ? JSON.parse(device.scanReport) : null;

  return (
    <Card sx={{ backgroundColor: statusColor[device.status] || 'grey.100', mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{device.deviceName}</Typography>
        <Typography variant="subtitle1">Type: {device.deviceType}</Typography>
        <Typography variant="subtitle2">Status: {device.status}</Typography>
        <Typography variant="body2">
          Last Scanned: {device.lastScanned ? new Date(device.lastScanned).toLocaleString() : 'Never'}
        </Typography>

        {scanData && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>Scan Report</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Emulator" secondary={scanData.emulator ? "Yes" : "No"} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Tablet" secondary={scanData.tablet ? "Yes" : "No"} />
              </ListItem>
              <ListItem>
                <ListItemText primary="WiFi Connected" secondary={scanData.wifi ? "Yes" : "No"} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Internet Reachable" secondary={scanData.connectionSecure ? "Yes" : "No"} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Suspicious Apps"
                  secondary={
                    scanData.suspiciousApps?.length > 0
                      ? scanData.suspiciousApps.join(', ')
                      : 'None detected'
                  }
                />
              </ListItem>
            </List>
          </>
        )}
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