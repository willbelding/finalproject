import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  useTheme
} from '@mui/material';

const DeviceCard = ({ device, refresh }) => {
  const token = localStorage.getItem('token');
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deleteDevice = async () => {
    try {
      await fetch(`http://localhost:5000/api/device/delete/${device.id}`, {
        method: 'DELETE',
        headers: { 'x-access-token': token }
      });
      setConfirmOpen(false);
      refresh();
    } catch (err) {
      alert('Failed to delete device.');
    }
  };

  const scanData = device.scanReport ? JSON.parse(device.scanReport) : null;
  const malwareApps = scanData?.malware || [];

  const statusColor = {
    'Scanned - Healthy': theme.palette.success.dark,
    'Scanned - Issues Found': theme.palette.error.dark,
    Healthy: theme.palette.success.main,
    Warning: theme.palette.warning.main,
    Critical: theme.palette.error.main
  };

  const cardStyle = {
    backgroundColor: statusColor[device.status] || theme.palette.grey[800],
    color: theme.palette.getContrastText(statusColor[device.status] || theme.palette.grey[800]),
    marginBottom: theme.spacing(2)
  };

  return (
    <>
      <Card sx={cardStyle}>
        <CardContent>
          <Typography variant="h6">{device.deviceName}</Typography>
          <Typography variant="subtitle1">Type: {device.deviceType}</Typography>
          <Typography variant="subtitle2">Status: {device.status}</Typography>
          <Typography variant="body2">
            Last Scanned: {device.lastScanned ? new Date(device.lastScanned).toLocaleString() : 'Never'}
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>Scan Report:</Typography>
          {malwareApps.length > 0 ? (
            <ul>
              {malwareApps.map((app, idx) => (
                <li key={idx}>{app}</li>
              ))}
            </ul>
          ) : (
            <Typography>No malware found in last scan.</Typography>
          )}
        </CardContent>

        <CardActions>
          <Button
            size="small"
            color="error"
            onClick={() => setConfirmOpen(true)}
          >
            Delete Device
          </Button>
        </CardActions>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Are you sure you want to delete this device?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={deleteDevice} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeviceCard;