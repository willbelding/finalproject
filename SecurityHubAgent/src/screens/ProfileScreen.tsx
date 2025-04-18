import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import API from '../utils/api';

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [passwordPassword, setPasswordPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/auth/profile');
      setEmail(res.data.email);
      setNewEmail(res.data.email);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to fetch profile info');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      if (!newEmail || !emailPassword) {
        Alert.alert('Validation Error', 'Please fill in all email fields.');
        return;
      }

      const res = await API.put('/auth/update-email', {
        newEmail,
        currentPassword: emailPassword,
      });

      setEmail(newEmail);
      setEmailPassword('');
      Alert.alert('Success', 'Email updated successfully.');
    } catch (err: any) {
      console.error('Email update error:', err?.response?.data || err.message);
      Alert.alert('Error', err?.response?.data?.message || 'Email update failed');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (!passwordPassword || !newPassword || !confirmPassword) {
        Alert.alert('Validation Error', 'Please fill in all password fields.');
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert('Validation Error', 'Passwords do not match.');
        return;
      }

      await API.put('/auth/update-password', {
        currentPassword: passwordPassword,
        newPassword,
      });

      setPasswordPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password updated successfully.');
    } catch (err: any) {
      console.error('Password update error:', err?.response?.data || err.message);
      Alert.alert('Error', err?.response?.data?.message || 'Password update failed');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile Settings</Text>

      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Change Email</Text>
        <Text style={styles.label}>New Email:</Text>
        <TextInput
          style={styles.input}
          value={newEmail}
          onChangeText={setNewEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Current Password:</Text>
        <TextInput
          style={styles.input}
          value={emailPassword}
          onChangeText={setEmailPassword}
          secureTextEntry
          textContentType="password"
        />
        <Button title="Update Email" onPress={handleUpdateEmail} />
      </View>

      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <Text style={styles.label}>Current Password:</Text>
        <TextInput
          style={styles.input}
          value={passwordPassword}
          onChangeText={setPasswordPassword}
          secureTextEntry
          textContentType="password"
        />
        <Text style={styles.label}>New Password:</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          textContentType="newPassword"
        />
        <Text style={styles.label}>Confirm New Password:</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="newPassword"
        />
        <Button title="Update Password" onPress={handleUpdatePassword} color="#007AFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  box: {
    backgroundColor: '#f0f4ff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
  },
  label: { marginTop: 15, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    color: '#000',
  },
});