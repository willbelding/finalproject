// This file is used to 
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { performSecurityScan } from '../utils/securityUtils';
import API from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifyScanResult, setupNotificationChannel } from '../utils/notifications';
import { ProgressBar } from '@react-native-community/progress-bar-android';

// This defines the main functional component for the scan screen.
export default function ScanScreen({ navigation }: { navigation: any }) { // prop retrieval for screen navigation
  // State initialisations
  const { colors } = useTheme();
  const [result, setResult] = useState<any>(null); // Object to save result of the scan.
  const [loading, setLoading] = useState(false); // Boolean state to clarify if scan is being carried out.
  const [progress, setProgress] = useState(0); // Used to track the progress of the scan.
  const [currentApp, setCurrentApp] = useState(''); // Used during scan process to display app being scanned.
  const [error, setError] = useState(''); // Stores any error messages during scan.

  // Hook to run callback when ScanScreen is in use.
  useFocusEffect(
    useCallback(() => {
      setResult(null);
      setError('');
    }, [])
  );

  // A function to initiate the security scan.
  const runScan = async (showAlert = true) => {
    try { // try catch block to handle scan process and any errors.
      if (showAlert) {
        // If showAlert is true, then the loading state is set to true,
        // previous errors are cleared, and result state is set to reset
        // before another scan is carried out. 
        setLoading(true);
        setError('');
        setResult(null);
      }
      // The core block for scan initiation. the performSecurityScan function is called
      // then awaits a result. 
      const scan = await performSecurityScan({
        // Callback functions are provided
        onProgress: (p: number) => setProgress(p),
        onAppScan: (appName: string) => setCurrentApp(appName),
      });

      // Device ID is retrieved from AsyncStorage.
      const deviceId = await AsyncStorage.getItem('deviceId');
      // If the id is not found, an error is thrown.
      if (!deviceId) throw new Error('Device not registered');
      // This section prepares the results of the scan and the deviceId
      // To be sent to the backend API.
      const { deviceId: _omit, ...cleanedScan } = scan; // Removes deviceId from scan object
      const payload = { ...cleanedScan, deviceId }; // Includes deviceID in the payload
      await API.post('/device/scan', payload); // Post request to endpoint including the payload containing deviceId.
      
      // Some conditional logic based upon the showAlert flag for manual and background scans.
      if (showAlert) {
        // If true (manual scan) show a message to the user that the scan was completed.
        Alert.alert('Scan Complete', 'Scan finished and data saved.', [
          {
            text: 'OK',
            onPress: () => {
              // Once the user presses the ok button, the user it taken to one of two screens.
              if (scan.malware.length > 0) {
                // If malware was found, they will be taken to the "malware found" screen, 
                navigation.navigate('Malware Found', { malware: scan.malware });
              } else {
                // If no malware was found, they will be taken to the "scan results" page (clean screen).
                navigation.navigate('Scan Results');
              }
            },
          },
        ]);
      } else {
        // If false (background scan) the notifyScanResult function is called
        // to diplsay a notification of the scan result to the user.
        notifyScanResult(scan.scanHealth, scan.malware.length);
      }
    } catch (err: any) {
      // Error handling for API calls or scan issues.
      console.error('Scan error:', err?.response?.data || err.message);
      if (showAlert) {
        setError(err?.response?.data?.message || 'Scan failed');
      }
    } finally {
      // This will execute no matter whether the showAlert is true or false.
      if (showAlert) setLoading(false); // if it is true, loading is set back to false.
      setProgress(0); // Progress state reset
      setCurrentApp(''); //currentApp state reset
    }
  };

  // This block is a hook that, when the component mounts,
  // sets up background tasks.
  useEffect(() => {
    setupNotificationChannel();
    const interval = setInterval(() => {
      // An interval timer that calls the runScan function every 6 hours.
      // Also contains a false argument to ensure no alerts are shown.
      runScan(false);
    }, 1000 * 60 * 60 * 6);
    return () => clearInterval(interval); // Called when the component unmounts or prior to running to effect again.
  }, []); // Ensuring the timer is cleared to stop memory leaks.

  // This block renders the UI for this screen.
  return (
    // A button is also added to manually trigger the runScan function.
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.button} onPress={() => runScan(true)}>
      <Text style={styles.buttonText}>Start Scan</Text>
      </TouchableOpacity>
      {loading && ( /* Displays elements based on loading states */
        <View style={styles.progressContainer}>
          {Platform.OS === 'android' && ( /* Android platform is defined */
            <ProgressBar styleAttr="Horizontal" progress={progress} indeterminate={false} style={styles.progressBar} />
          )}
          <Text style={{ color: colors.text, marginTop: 8 }}>Scan in Progress: {currentApp}</Text>
        </View> /* Text indicating that the scan is in progress */
      )}
      {error !== '' && <Text style={[styles.error, { color: 'red' }]}>{error}</Text>}
      {result && ( // Defines the styling of all the elements within a scan report.

        // Emulator, Tablet, and Connected elements are set to either yes or no values
        // depending on the results of the scan.
        <View style={[styles.resultBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.resultTitle, { color: colors.text }]}>Scan Summary</Text>
          <Text style={{ color: colors.text }}>Device ID: {result.deviceId}</Text>
          <Text style={{ color: colors.text }}>Emulator: {result.emulator ? 'Yes' : 'No'}</Text>
          <Text style={{ color: colors.text }}>Tablet: {result.tablet ? 'Yes' : 'No'}</Text>
          <Text style={{ color: colors.text }}>Network Type: {result.networkType}</Text>
          <Text style={{ color: colors.text }}>Connected: {result.isConnected ? 'Yes' : 'No'}</Text>
          <Text style={{ color: colors.text }}>Status: {result.scanHealth}</Text>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            Malware Detected ({result.malware.length}):
          </Text>
          {result.malware.length > 0 ? ( /* Displays the malware list along with some styling implementations */
            result.malware.map((app: string, i: number) => (
              <Text key={`malware-${i}`} style={{ color: colors.text }}>
                - {app}
              </Text>
            ))
          ) : (
            <Text style={{ color: colors.text }}>None</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

// Stlying all the components in the scan screen page to ensure
// proper layout and consistent appearance.
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultBox: {
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
    marginVertical: 10,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
  },

  progressBar: {
    alignSelf: 'stretch',
    height: 10,
    marginHorizontal: 20,
  },

  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 8,
    width: '90%',
    alignItems: 'center',
    elevation: 2,

  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});