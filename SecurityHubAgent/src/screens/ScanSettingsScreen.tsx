// This file is used to manage the scan settings page.
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, Platform, TouchableOpacity, ScrollView, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';

// This block defines the intervalOptions array to define the frequency options
// for the auto-scan feature. As you can see, each object has the length labeled and
// the associated value in ms. 
const intervalOptions = [
  { label: 'Every hour', value: '3600000' },
  { label: 'Every 6 hours', value: '21600000' },
  { label: 'Every 12 hours', value: '43200000' },
  { label: 'Every 24 hours', value: '86400000' },
  { label: 'Every 48 hours', value: '172800000' },
  { label: 'Every 7 days', value: '604800000' },
];

// Stating the function for the scan settings screen. This will let user
// alter their method of security by allowed automatic scans and a toggle for notifications
// of the results.
export default function ScanSettingsScreen() {
  // Finds whether automated scans are enabled by the user.
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  // Checks if the user has enabled notifications.
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  // Store the selected automatic scan interval. 
  const [selectedInterval, setIntervalValue] = useState<string>('3600000');
  const { dark } = useTheme();

  // A hook that will run when component mounts to retrieve current
  // scan settings from AsynStorage.
  useEffect(() => {
    loadSettings();
  }, []);

  // This function loads the scan settings from storage.
  const loadSettings = async () => {
    try {
      // These three variables together will get the value that
      // is stored for the automatic scan status, the stored notification status
      // value, and the value stored for the selected scan interval.
      const storedScan = await AsyncStorage.getItem('autoScanEnabled');
      const storedNotify = await AsyncStorage.getItem('notifyEnabled');
      const storedInterval = await AsyncStorage.getItem('scanInterval');
      // These three conditions are reponsible for updating the realted states for each
      // of these variables if the value for each of them is found.
      if (storedScan) setAutoScanEnabled(storedScan === 'true');
      if (storedNotify) setNotificationsEnabled(storedNotify === 'true');
      if (storedInterval) setIntervalValue(storedInterval);
    } catch (err) {
      // If the values are not found, an error message is displayed.
      console.error('Failed to load scan settings:', err);
    }
  };

  // This function saves the current settings of a user to AsyncStorage.
  const saveSettings = async () => {
    try {
      // These three statement are needed to save the current state
      // for the settings to AsyncStorage.
      await AsyncStorage.setItem('autoScanEnabled', autoScanEnabled.toString());
      await AsyncStorage.setItem('notifyEnabled', notificationsEnabled.toString());
      await AsyncStorage.setItem('scanInterval', selectedInterval);
      
      // A success alert is shown if this save was completed
      Alert.alert('Saved', 'Scan settings were updated successfully');
    } catch (err) {
      // Otherwise, a relevant error message is displayed
      console.error('Error saving the scan settings:', err);
      Alert.alert('Error', 'Failed to save scan settings');
    }
  };

  // This renders the UI for the scan settings screen.
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: dark ? '#000' : '#f8fafc' }]}>
      {/* This is the styling for the scan setting page header */}
      <Text style={[styles.heading, { color: dark ? '#fff' : '#000' }]}>Scan Settings</Text>
      {/* This is the styling for the auto-scan toggle */}
      <View style={[styles.card, { backgroundColor: dark ? '#1e1e1e' : '#f0f4ff' }]}>
        <Text style={[styles.label, { color: dark ? '#fff' : '#333' }]}>Enable Auto-Scan:</Text>
        {/* This is a switch component to toggle between the options */}
        <Switch value={autoScanEnabled} onValueChange={setAutoScanEnabled} />
      </View>

      {/* This is the card styling for the notifications toggle */}
      <View style={[styles.card, { backgroundColor: dark ? '#1e1e1e' : '#f0f4ff' }]}>
        <Text style={[styles.label, { color: dark ? '#fff' : '#333' }]}>Notification on Scan Result:</Text>
        {/* This is a switch component to toggle between options*/}
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      {/* This is the conditional renderer for the auto scanning frequency picker */}
      {autoScanEnabled && ( // If auto scanning is enabled, show the following.
        <View style={[styles.card, { backgroundColor: dark ? '#1e1e1e' : '#f0f4ff' }]}>
          <Text style={[styles.label, { color: dark ? '#fff' : '#333' }]}>Auto-Scan Frequency:</Text>
          <Picker
            selectedValue={selectedInterval}
            onValueChange={(itemValue: string) => setIntervalValue(itemValue)}
            style={[
              styles.picker,
              {
                color: dark ? '#fff' : '#000',
                backgroundColor: dark ? '#2a2a2a' : '#fff',
              },
            ]}
            dropdownIconColor={dark ? '#fff' : '#000'}
          >
            {intervalOptions.map((option) => ( // This goes through all the interval options to create
            // components for the picker.
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
                color={dark ? '#fff' : '#000'}
              />
            ))}
          </Picker>
        </View>
      )}
      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// This is my stylesheet for the scan settings screen.
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  picker: {
    height: 60,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});