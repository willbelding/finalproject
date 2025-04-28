// This file is needed to provide the functions for the authentication
// of a user. Including login, register, logout, and token management.
// It also carries out error handling in device registration.
import API from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

// This handles the user login function.
export async function login(email: string, password: string) {
  try {
    const response = await API.post('/auth/signin', { email, password }); // Sending credentials to API
    const token = response.data.accessToken;
    await AsyncStorage.setItem('token', token); // Storing recieved token

    const deviceName = await DeviceInfo.getDeviceName();
    const deviceType = DeviceInfo.getDeviceType();
    const deviceId = await DeviceInfo.getUniqueId();

    // Device information is registered
    const registerResponse = await API.post('/device/register', {
      deviceName,
      deviceType,
      deviceId,
    });
    await AsyncStorage.setItem('deviceId', registerResponse.data.id.toString());
  } catch (err) { // If the login fails, error message is displayed.
    console.error('Login error:', err);
    throw err;
  }
}

// handles the registration of a user.
export async function register(email: string, password: string) {
  await API.post('/auth/signup', { email, password }); // sends credentials to API
  await login(email, password);
}

// handles the user logout function
export async function logout() {
  await AsyncStorage.removeItem('token'); // authentication token is removed
  await AsyncStorage.removeItem('deviceId'); // deviceID removed from AsyncStorage
}

// This function retrieves the auth token from storage.
export async function getToken() {
  return await AsyncStorage.getItem('token');
}