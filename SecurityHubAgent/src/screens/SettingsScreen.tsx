// This file is needed for the stating the contents and functions of the settings page.
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, } from 'react-native';
import { logout } from '../utils/auth';
import { useTheme } from '@react-navigation/native';

// States the function for the settings screen and recieves the navigation prop
// with React navigation.
export default function SettingsScreen({ navigation }: any) {
  const { colors } = useTheme();

  // This is a function to handle the logout process.
  const handleLogout = () => {
    // Confirmation alert to ensure the user wants to log out.
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      // Option to cancel logout for the user
      { text: 'Cancel', style: 'cancel' },
      {
        // When log out is pressed, the user is logged out and they are
        // navigated back to the login page.
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          // The logout function is called on log out button press
          logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  // This renders the UI for the setting screen.
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* These are all the buttons that are available on the settings page
      and each will perform the appropriate actions according to which button is pressed. */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Colour Scheme')}>
        <Text style={styles.buttonText}>Colour Scheme</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scan Settings')}>
        <Text style={styles.buttonText}>Scan Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

// This is the style sheet for the setting page to ensure all
// element are sized, ordered, and designed neatly.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
  },
});