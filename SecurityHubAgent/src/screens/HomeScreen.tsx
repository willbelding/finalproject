// This file is needed to create the home page of the app.
import React from 'react';
import { View, FlatList, StyleSheet, Text, Image, TouchableOpacity, } from 'react-native';
import { useTheme } from '@react-navigation/native';

// This establishes the colour theme of the home screen.
export default function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();

  // This establishes the contents of the home page.
  return (
    /* This is the HomeGuardSecurity Logo that appears at the top of the page*/
    /* The remaing sections all esablish the require buttons that take the user
    to pages such as the scan device, scan history, about us, and settings*/
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={require('../../assets/hgs_logo.png')} style={styles.logo} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scan')}>
        <Text style={styles.buttonText}>Scan This Device</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scan History')}>
        <Text style={styles.buttonText}>Scan History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('About Us')}>
        <Text style={styles.buttonText}>About Us</Text>
      </TouchableOpacity>
    </View>
  );
}
// The orders these elements in an orderly method to ensure good presentation across all
// various types of devices.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', /* Aligns all the elements in the middle of the screen*/
    paddingHorizontal: 16, 
    paddingTop: 30,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain', /* A image resource of React Native that fits the logo */
    marginBottom: 20,      /* inside an image container to maintain the aspect ratio. */
  },
  button: {
    backgroundColor: '#2563eb', /* This was set as a blue colour to maintain easy visibility */
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 8,
    width: '90%',
    alignItems: 'center', /* Button is centered in the middle of the page */
    elevation: 2,
  },
  buttonText: { 
    color: '#fff', /* white text colour */ 
    fontSize: 16,
    fontWeight: '600',
  },
});