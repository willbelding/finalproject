// This file is responsible for how the device scan history is displayed
// within the dashboard.
import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, Divider, useTheme } from '@mui/material';
import axios from 'axios';

// This component is used to display the scan history
// for any given device.
const DeviceScanHistory = ({ deviceId }) => {
  // This is used to declar the state for the scan history data
  const [history, setHistory] = useState([]);
  // This establishes the design based upon the dark/light mode toggle setting.
  const theme = useTheme();

  // This fetches the scan history of the device.
  useEffect(() => {
    axios.get(`/api/scan-history/${deviceId}`)
      .then(res => setHistory(res.data))
      .catch(() => setHistory([]));
  }, [deviceId]);

  // A check to see if the dark mode is enabled.
  const isDark = theme.palette.mode === 'dark';

  // The process if there isn't any scan history data for the device.
  if (!history.length) { // If there is no scan data, display the following message.
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="h6">Records</Typography>
        <Typography>No scan history found for this device.</Typography>
      </Box>
    );
  }

  // This renders the design of the scan history cards (All record cards follow the same design).
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Records</Typography>
      {history.map((item, idx) => (
        <Card
          key={idx}
          sx={{
            mb: 2,
            p: 2,
            bgcolor: isDark ? '#23272b' : '#f8fafc',
            color: isDark ? '#fff' : '#111',
            boxShadow: 2
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" sx={{ color: isDark ? '#cfcfcf' : 'text.secondary' }}>
              {new Date(item.createdAt).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 1, bgcolor: isDark ? '#444' : undefined }} />
            <Typography variant="body1" fontWeight={600}>
              Scan Health:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {item.scanResult?.scanHealth || 'Unknown'}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              Malware Detected:
            </Typography>
            {item.scanResult?.malware?.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {item.scanResult.malware.map((app, i) => (
                  <Chip
                    key={i}
                    label={app}
                    color="error"
                    sx={{
                      bgcolor: isDark ? '#b71c1c' : undefined,
                      color: '#fff'
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ mt: 1 }}>None</Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DeviceScanHistory;