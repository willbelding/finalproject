import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ScanHistoryItem {
  createdAt: string;
  scanResult: any;
}

interface Props {
  deviceId: string;
}

export default function DeviceScanHistory({ deviceId }: Props) {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    axios.get(`/api/scan-history/${deviceId}`).then(res => {
      setHistory(res.data);
    });
  }, [deviceId]);

  return (
    <div>
      <h2>Scan History</h2>
      {history.map((scan, idx) => (
        <div key={idx}>
          <p>{new Date(scan.createdAt).toLocaleString()}</p>
          <pre>{JSON.stringify(scan.scanResult, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}