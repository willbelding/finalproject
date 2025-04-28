// This file is needed to establish the design of the login page on the mobile app.
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, } from 'react-native';
import { login } from '../utils/auth';
import { registerDeviceIfNeeded } from '../utils/device';
import { useTheme } from '@react-navigation/native';

// Exports the login screen design.
export default function LoginScreen({ navigation }: any) {
  const { colors, dark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // A handler for login actions. Registers the device.
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      await registerDeviceIfNeeded();
      navigation.navigate('Home');
    } catch (err: any) {
      // Provides the details of any login error.
      console.log('Login Error:', err?.response?.data || err.message);
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        // An error message for when credentials do not match an existing account
        // or if there is a network failure.
        setError('Login failed. Please check your network or credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sets the style of the login page.
  return (
    /* This adds the HomeGuard Security logo at the top of the page.
    This is then following by the styling for the login form which will appear below */
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={require('../../assets/hgs_logo.png')} style={styles.logo} />
      <Text style={[styles.title, { color: colors.text }]}>Login</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: dark ? '#2c2c2e' : '#fff',
            color: colors.text,
            borderColor: dark ? '#3a3a3c' : colors.border,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={dark ? '#aaa' : '#888'}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: dark ? '#2c2c2e' : '#fff',
            color: colors.text,
            borderColor: dark ? '#3a3a3c' : colors.border,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={dark ? '#aaa' : '#888'}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>   
      )}
    </View>
  );
}

// This sets the positioning and size of the login page elements.
// For example, the logo has a set width and height of the same value, and
// the login button is aligned in the center of the screen.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});