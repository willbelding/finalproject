// This file is needed to define the functions and UI of the Scan History page.
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, } from 'react-native';
import API from '../utils/api';
import DeviceInfo from 'react-native-device-info';
import { useTheme } from '@react-navigation/native';

// Defines the main functional component (ScanHistoryScreen).
export default function ScanHistoryScreen() {
  const { colors, dark } = useTheme();
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // The function to fetch scan history data
  const fetchHistory = async () => {
    const id = await DeviceInfo.getUniqueId(); // Retrieves unique identifier for the device.
    setDeviceId(id); // updates deviceId state with retrieved value.
    try { // Handles errors in this process.
      const res = await API.get(`/scan-history/${id}`); // GET request to deviceId endpoint of the API through unique device ID.
      setScanHistory(res.data); // If API is completed, scanHistory state is updated with the data found.
    } catch (err) {
      // Otherwise, an error message is displayed.
      console.error('Failed to fetch scan history:', err);
    }
  };

  // This handles the function of clearing the scan history of a device.
  const clearHistory = () => {
    Alert.alert(
      // Provides a confirmation prompt that the user will see once they
      // press the delete history button.
      'Confirm Deletion',
      'Are you sure you want to clear scan history?',
      [
        // Provides an option to cancel the deletion.
        { text: 'Cancel', style: 'cancel' },
        {
          // Provides the option to confirm the deletion of scan history.
          text: 'Clear',
          style: 'destructive',
          // Once pressed, the function is activated. 
          onPress: async () => {
            try { // Error handling for history deletion.
              await API.delete(`/scan-history/${deviceId}`); // Delete request is sent to the relevant endpoint to delete device scan history.
              setScanHistory([]); // If successful, the scanHistory state is cleared and UI is updated.
            } catch (err) {
              // Otherwise, an error message is displayed.
              console.error('Failed to delete scan history:', err);
            }
          },
        },
      ]
    );
  };

  // After the component mounts, this hook will run the fetchHistory function. 
  useEffect(() => {
    fetchHistory();
  }, []); // Ensures scan history is fetched when the screen is loaded.

  // This function is used to render the scanHistory array items.
  const renderItem = ({ item }: { item: any }) => ( // each item property represents a single scan history entry.
    // This is the style for each record container.
    <View
      style={[
        styles.card,
        {
          // Styles based upon chosen theme.
          backgroundColor: dark ? '#1e1e1e' : '#ffffff',
          borderColor: dark ? '#000' : '#007bff',
        },
      ]}
      
      //Displays the data and time of each scan and styles labels.
    >
      <Text style={[styles.date, { color: colors.text }]}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Text style={[styles.label, { color: '#ffffff' }]}>Scan Health:</Text>
      <Text style={[styles.value, { color: colors.text }]}>
        {item.scanResult.scanHealth}
      </Text>
      <Text style={[styles.label, { color: '#ffffff' }]}>Malware Detected:</Text>
      {item.scanResult.malware?.length > 0 ? ( /* A check to see if malware array has any items */
        item.scanResult.malware.map((app: string, index: number) => (
          /* If detected, the malware array is mapped over and a text component for each malicious app is rendered */
          <Text key={index} style={[styles.value, { color: colors.text }]}>- {app}</Text>
        ))
      ) : ( /* If not malware is detected, don't display anything */
        <Text style={[styles.value, { color: colors.text }]}>None</Text>
      )}
    </View>
  );

  // This returns the full styling for the scan history page.
  return (
    <View style={[styles.container, { backgroundColor: dark ? '#121212' : '#e6f0ff' }]}>
      <Text style={[styles.header, { color: dark ? '#fff' : '#003366' }]}>
        Scan History
      </Text>

      <FlatList /* efficiently renders the history records */
        data={scanHistory}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />

      {scanHistory.length > 0 && ( /* Clear History button */
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>CLEAR HISTORY</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Defines all the component styles for simple layout and appearance. 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  date: {
    fontWeight: '600',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    elevation: 2,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});