// This is the styling for the screen a user will be taken to if their
// scan didn't detect any malware.
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '@react-navigation/native';

// Uses whatever theme is in use.
const CleanScreen = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme();

  // Returns relevant feedback for scans with no issues.
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>NO MALWARE DETECTED</Text>
      <Text style={[styles.message, { color: colors.text }]}>
        Good news! Your device is clean and safe. 
      </Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

// This sets some basic styling fot the container, title, and feedback message on the scan result.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
export default CleanScreen;