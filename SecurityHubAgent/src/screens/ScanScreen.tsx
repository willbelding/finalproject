import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { performSecurityScan } from '../utils/securityUtils';
import API from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifyScanResult, setupNotificationChannel } from '../utils/notifications';

export default function ScanScreen({ navigation }: { navigation: any }) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state when returning to this screen
  useFocusEffect(
    useCallback(() => {
      setResult(null);
      setError('');
    }, [])
  );

  const runScan = async (showAlert = true) => {
    try {
      if (showAlert) {
        setLoading(true);
        setError('');
        setResult(null);
      }
      const scan = await performSecurityScan();
      const deviceId = await AsyncStorage.getItem('deviceId');
      if (!deviceId) throw new Error('Device not registered');
      const { deviceId: _omit, ...cleanedScan } = scan;
      const payload = { ...cleanedScan, deviceId };
      await API.post('/device/scan', payload);

      if (showAlert) {
        Alert.alert('Scan Complete', 'Security scan finished and data saved.', [
          {
            text: 'OK',
            onPress: () => {
              if (scan.malware.length > 0) {
                navigation.navigate('MalwareDetectedScreen', { malware: scan.malware });
              } else {
                navigation.navigate('CleanScreen');
              }
            },
          },
        ]);
      } else {
        notifyScanResult(scan.scanHealth, scan.malware.length);
      }
    } catch (err: any) {
      console.error('Scan error:', err?.response?.data || err.message);
      if (showAlert) {
        setError(err?.response?.data?.message || 'Scan failed');
      }
    } finally {
      if (showAlert) setLoading(false);
    }
  };

  useEffect(() => {
    setupNotificationChannel();
    const interval = setInterval(() => {
      runScan(false);
    }, 1000 * 60 * 60 * 6); // Every 6 hours
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Start Scan" onPress={() => runScan(true)} />
      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Scan Summary</Text>
          <Text>Device ID: {result.deviceId}</Text>
          <Text>Emulator: {result.emulator ? 'Yes' : 'No'}</Text>
          <Text>Tablet: {result.tablet ? 'Yes' : 'No'}</Text>
          <Text>Network Type: {result.networkType}</Text>
          <Text>Connected: {result.isConnected ? 'Yes' : 'No'}</Text>
          <Text>Status: {result.scanHealth}</Text>
          <Text style={styles.subTitle}>Malware Detected ({result.malware.length}):</Text>
          {result.malware.length > 0
            ? result.malware.map((app: string, i: number) => (
                <Text key={`malware-${i}`}>- {app}</Text>
              ))
            : <Text>None</Text>}
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
    marginTop: 12,
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