import API from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

export async function login(email: string, password: string) {
  try {
    const response = await API.post('/auth/signin', { email, password });
    const token = response.data.accessToken;
    await AsyncStorage.setItem('token', token);

    const deviceName = await DeviceInfo.getDeviceName();
    const deviceType = DeviceInfo.getDeviceType();
    const deviceId = await DeviceInfo.getUniqueId();

    const registerResponse = await API.post('/device/register', {
      deviceName,
      deviceType,
      deviceId,
    });

    await AsyncStorage.setItem('deviceId', registerResponse.data.id.toString());
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

export async function register(email: string, password: string) {
  const response = await API.post('/auth/signup', { email, password });
  await AsyncStorage.setItem('token', response.data.accessToken);
}

export async function logout() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('deviceId');
}

export async function getToken() {
  return await AsyncStorage.getItem('token');
}