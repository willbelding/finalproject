import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { logout } from '../utils/auth';

export default function SettingsScreen({ navigation }: any) {
  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Colour Scheme" onPress={() => navigation.navigate('ColourScheme')} />
      <Button title="Scan Settings" onPress={() => navigation.navigate('ScanSettings')} />
      <Button title="Log Out" color="#d9534f" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-evenly',
  },
});