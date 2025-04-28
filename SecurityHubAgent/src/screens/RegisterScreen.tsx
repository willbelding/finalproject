import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { register } from '../utils/auth';
import { useTheme } from '@react-navigation/native';

export default function RegisterScreen({ navigation }: any) {
  const { colors, dark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await register(email, password);
      navigation.navigate('Login');
    } catch (err: any) {
      console.log('Create Account Error: ', err.response?.data || err.message);
      setError(
        err?.response?.data?.message || 'Registration Failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={require('../../assets/hgs_logo.png')} style={styles.logo} />
      <Text style={[styles.title, { color: colors.text }]}>Register</Text>
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
        <>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#16a34a', marginTop: 10 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

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