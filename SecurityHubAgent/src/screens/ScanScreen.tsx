import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import { performSecurityScan } from '../utils/securityUtils';
import API from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ScanScreen() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runScan = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const scan = await performSecurityScan();
      const deviceId = await AsyncStorage.getItem('deviceId');

      if (!deviceId) {
        throw new Error('Device not registered');
      }

      const { deviceId: _omit, ...cleanedScan } = scan;
      const payload = { ...cleanedScan, deviceId };
      const response = await API.post('/device/scan', payload);

      console.log('Scan sent:', response.data);
      setResult(scan);

      Alert.alert("Scan Complete", "Security scan finished and data saved.");
    } catch (err: any) {
      console.error('Scan error:', err?.response?.data || err.message);
      setError(err?.response?.data?.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Start Scan" onPress={runScan} />

      {loading && <ActivityIndicator size="large" style={styles.loader} />}

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Scan Summary</Text>
          <Text>Emulator: {result.emulator ? 'Yes' : 'No'}</Text>
          <Text>Tablet: {result.tablet ? 'Yes' : 'No'}</Text>
          <Text>Network Type: {result.networkType}</Text>
          <Text>Connected: {result.isConnected ? 'Yes' : 'No'}</Text>
          <Text>Status: {result.scanHealth}</Text>

          <Text style={styles.subTitle}>Suspicious Apps:</Text>
          {result.suspiciousApps.length > 0 ? (
            result.suspiciousApps.map((app: any, index: number) => (
              <Text key={index}>- {app.name} ({app.packageName})</Text>
            ))
          ) : (
            <Text>None detected</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  resultBox: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    marginTop: 10,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
});