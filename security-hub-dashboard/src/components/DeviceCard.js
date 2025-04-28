import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useTheme
} from '@mui/material';
import DeviceScanHistory from '../pages/DeviceScanHistory';

const DeviceCard = ({ device, refresh }) => {
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const token = localStorage.getItem('token');
  const [historyOpen, setHistoryOpen] = useState(false);

  // If a scan report exists, this will retrieve it.
  let scanData = null;
  try {
    scanData = device.scanReport ? JSON.parse(device.scanReport) : null;
  } catch {
    scanData = null;
  }
  const malware = scanData?.malware || [];
  const hasScan = !!scanData;

  // This is how the device card will be styled depending on whether there
  // is any scan data for that device or not.
  let cardBg = theme.palette.background.paper;
  let cardText = theme.palette.text.primary;
  if (hasScan) {
    if (malware.length > 0) {
      cardBg = '#d32f2f'; // The card background will be red if there is any scan data
      cardText = '#fff';  // The colour of the text will be white so viewing is clearer
    } else {
      cardBg = '#388e3c'; // The card background will be 
      cardText = '#fff';
    }
  }

  // This is how the delete button will be styled.
  const buttonStyle = {
    backgroundColor: '#1976d2', // The fixed colour will be blue
    color: hasScan ? '#fff' : '#000',
    marginTop: theme.spacing(2),
    fontWeight: 600,
    '&:hover': { backgroundColor: '#115293' }
  };

  // Delete logic
  const deleteDevice = async () => {
    try {
      await fetch(`http://localhost:5000/api/device/delete/${device.id}`, {
        method: 'DELETE',
        headers: { 'x-access-token': token }
      });
      setConfirmOpen(false);
      refresh();
    } catch {
      alert('Failed to delete device.');
    }
  };

  return (
    <>
      <Card sx={{ backgroundColor: cardBg, color: cardText, marginBottom: theme.spacing(3) }}>
        <CardContent>
          <Typography variant="h6">{device.deviceName}</Typography>
          <Typography variant="subtitle1">Type: {device.deviceType}</Typography>
          <Typography variant="body2">
            Last Scanned: {device.lastScanned ? new Date(device.lastScanned).toLocaleString() : 'Never'}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Scan Health:</Typography>
          <Typography variant="body2">
            {hasScan ? (malware.length > 0 ? "Critical (malware found)" : "Safe (no malware found)") : "No scan data."}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Threat Level:</Typography>
          <Typography variant="body2">
            {hasScan ? (malware.length > 0 ? "Critical" : "Safe") : "Unknown"}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Malware Detected:</Typography>
          <Typography variant="body2">
            {hasScan ? (malware.length > 0 ? malware.join(", ") : "No malware found.") : "No malware found."}
          </Typography>
          <Button
            sx={{ // Scan History button styling has been added manually
              backgroundColor: '#1976d2',
              color: hasScan ? '#fff' : '#000',
              marginTop: theme.spacing(2),
              fontWeight: 600,
              marginRight: theme.spacing(2), // This ensures spacing between the delete button.
              '&:hover': { backgroundColor: '#115293' }
            }}
            variant="contained"
            onClick={() => setHistoryOpen(true)}
          >
            Scan History
          </Button>
          <Button
            sx={buttonStyle} // This is the delete device button
            variant="contained"
            onClick={() => setConfirmOpen(true)} // Opens a delete confirm? message when clicked.
          >
            Delete Device
          </Button>
        </CardContent>
      </Card> 
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Are you sure you want to delete this device?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={deleteDevice} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle><span style={{ fontWeight: 'bold'}}> Scan History for {device.deviceName}</span></DialogTitle>
        <DialogContent>
          <DeviceScanHistory deviceId={device.id} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default DeviceCard;