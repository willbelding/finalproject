import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Button,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const intervalOptions = [
  { label: 'Every hour', value: '3600000' },
  { label: 'Every 6 hours', value: '21600000' },
  { label: 'Every 12 hours', value: '43200000' },
  { label: 'Every 24 hours', value: '86400000' },
  { label: 'Every 48 hours', value: '172800000' },
  { label: 'Every 7 days', value: '604800000' },
];

export default function ScanSettingsScreen() {
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedInterval, setIntervalValue] = useState<string>('3600000');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedScan = await AsyncStorage.getItem('autoScanEnabled');
      const storedNotify = await AsyncStorage.getItem('notifyEnabled');
      const storedInterval = await AsyncStorage.getItem('scanInterval');
      if (storedScan) setAutoScanEnabled(storedScan === 'true');
      if (storedNotify) setNotificationsEnabled(storedNotify === 'true');
      if (storedInterval) setIntervalValue(storedInterval);
    } catch (err) {
      console.error('Failed to load scan settings:', err);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('autoScanEnabled', autoScanEnabled.toString());
      await AsyncStorage.setItem('notifyEnabled', notificationsEnabled.toString());
      await AsyncStorage.setItem('scanInterval', selectedInterval);
      Alert.alert('Saved', 'Scan settings updated successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Scan Settings</Text>

      <View style={styles.settingBox}>
        <Text style={styles.label}>Enable Auto-Scan:</Text>
        <Switch
          value={autoScanEnabled}
          onValueChange={setAutoScanEnabled}
        />
      </View>

      <View style={styles.settingBox}>
        <Text style={styles.label}>Notification on Scan Result:</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      {autoScanEnabled && (
        <View style={styles.settingBox}>
          <Text style={styles.label}>Auto-Scan Frequency:</Text>
          <Picker
            selectedValue={selectedInterval}
            onValueChange={(itemValue: string) => setIntervalValue(itemValue)}
            style={Platform.OS === 'ios' ? undefined : styles.picker}
          >
            {intervalOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      )}

      <Button title="Save Settings" onPress={saveSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  settingBox: {
    marginBottom: 20,
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});