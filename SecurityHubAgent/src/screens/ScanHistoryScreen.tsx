import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import API from '../utils/api';
import DeviceInfo from 'react-native-device-info';

export default function ScanHistoryScreen() {
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const fetchHistory = async () => {
    const id = await DeviceInfo.getUniqueId();
    setDeviceId(id);
    try {
      const res = await API.get(`/scan-history/${id}`);
      setScanHistory(res.data);
    } catch (err) {
      console.error('Failed to load scan history:', err);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to clear all scan history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await API.delete(`/scan-history/${deviceId}`);
              setScanHistory([]);
            } catch (err) {
              console.error('Failed to clear scan history:', err);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
      <Text style={styles.label}>Scan Health:</Text>
      <Text style={styles.value}>{item.scanResult.scanHealth}</Text>
      <Text style={styles.label}>Malware Detected:</Text>
      {item.scanResult.malware?.length > 0 ? (
        item.scanResult.malware.map((app: string, index: number) => (
          <Text key={index} style={styles.value}>- {app}</Text>
        ))
      ) : (
        <Text style={styles.value}>None</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scan History</Text>
      <FlatList
        data={scanHistory}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />
      {scanHistory.length > 0 && (
        <Button title="Clear History" color="#d9534f" onPress={clearHistory} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e6f0ff' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#007bff',
    borderWidth: 1,
  },
  date: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#003366',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
});