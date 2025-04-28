// This file is used to define how the profile screen will function and look.
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, } from 'react-native';
import API from '../utils/api';
import { useTheme } from '@react-navigation/native';

export default function ProfileScreen() {
  const { colors, dark } = useTheme();
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [passwordPassword, setPasswordPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);

  // This is a useEffect hook used in React. 
  useEffect(() => {
    fetchProfile(); // Executed when component mounts.
  }, []); // Only after the intial components render will the effect run. 

  const fetchProfile = async () => { // Fetch profile function
    // This is a try, catch, finally block that carries out error handling
    // during the profile fetching process.
    try {
      const res = await API.get('/auth/profile'); // API object to make GET request to the profile endpoint.
      // Updates the email and newEmail variables to the fetched email.
      setEmail(res.data.email);
      setNewEmail(res.data.email);
      //If an error occurs in this task, then an appropriate error message is displayed.
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Profile fetch failed.');
    } finally { //  Always executes (error or no error).
      setLoading(false); // sets a loading state variable to false to indicate process completion.
    }
  };

  // Function called when user want to update their email address.
  const handleUpdateEmail = async () => {
    // Basic validation to check whether state variables have values. 
    if (!newEmail || !emailPassword) {
      // If not, an error message is displayed detailing this. 
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    // This block handles another potential error in email updates.
    try {
      // Asynchronous PUT request to the update-email endpoint.
      await API.put('/auth/update-email', {
        newEmail, // An object containing newEmail.
        currentPassword: emailPassword, // An object containing users current password.
      });
      // If the update is successful, email state is set to the new email.
      setEmail(newEmail);
      setEmailPassword(''); // This clears the password from input after update is carried out.
      Alert.alert('Success', 'Email updated successfully.');
    } catch (err: any) {
      // Otherwise, an appropriate error message is displayed.
      Alert.alert('Error', err?.response?.data?.message || 'Email update failed');
    }
  };

  // This block performs error handling for password updates.
  const handleUpdatePassword = async () => {
    // If any field does not have a value, en error is displayed.
    if (!passwordPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    // This checks whether the new password and new password confirmation match.
    if (newPassword !== confirmPassword) {
      // If not, an error is displayed.
      Alert.alert('Validation Error', 'Passwords do not match. Please try again.');
      return;
    }
    // try catch block for password updates.
    try {
      // This carries out an asynchronous PUT request to the update-password endpoint.
      await API.put('/auth/update-password', {
        currentPassword: passwordPassword, // Object containing current password.
        newPassword, // Object containing the new password.
      });
      // If this update is successful, these 3 lines clear the password state variables.
      setPasswordPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Success message is displayed to confirm this.
      Alert.alert('Success', 'Password updated successfully.');
    } catch (err: any) {
      // Otherwise, an appropriate error message is displayed.
      Alert.alert('Error', err?.response?.data?.message || 'Password update failed');
    }
  };

  // React Native component used to display loading animation to inform user of activity.
  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;

  // This is how this page will be structured in the app.
  return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.background }]} contentContainerStyle={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>Profile Settings</Text>

      <View style={[styles.box, { backgroundColor: dark ? '#2a2a2a' : '#f0f4ff' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Email Change</Text>

        <Text style={[styles.label, { color: colors.text }]}>New Email:</Text>
        
        <TextInput
          style={[styles.input, { color: '#fff', backgroundColor: dark ? '#3a3a3a' : '#fff', borderColor: '#ccc' }]}
          value={newEmail}
          onChangeText={setNewEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={[styles.label, { color: colors.text }]}>Current Password:</Text>
        
        <TextInput
          style={[styles.input, { color: '#fff', backgroundColor: dark ? '#3a3a3a' : '#fff', borderColor: '#ccc' }]}
          value={emailPassword}
          onChangeText={setEmailPassword}
          secureTextEntry
          textContentType="password"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
          <Text style={styles.buttonText}>Update Email</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.box, { backgroundColor: dark ? '#2a2a2a' : '#f0f4ff' }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Password Change</Text>

        <Text style={[styles.label, { color: colors.text }]}>Current Password:</Text>
        
        <TextInput
          style={[styles.input, { color: '#fff', backgroundColor: dark ? '#3a3a3a' : '#fff', borderColor: '#ccc' }]}
          value={passwordPassword}
          onChangeText={setPasswordPassword}
          secureTextEntry
          textContentType="password"
        />

        <Text style={[styles.label, { color: colors.text }]}>New Password:</Text>
        
        <TextInput
          style={[styles.input, { color: '#fff', backgroundColor: dark ? '#3a3a3a' : '#fff', borderColor: '#ccc' }]}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          textContentType="newPassword"
        />

        <Text style={[styles.label, { color: colors.text }]}>Confirm New Password:</Text>
        
        <TextInput
          style={[styles.input, { color: '#fff', backgroundColor: dark ? '#3a3a3a' : '#fff', borderColor: '#ccc' }]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="newPassword"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Style sheet for the page elements to use.
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  scroll: {
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  box: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});