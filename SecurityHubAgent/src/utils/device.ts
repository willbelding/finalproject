// This file offers a function for registering a device with the backend API
// if it hadn't been registered before.
import DeviceInfo from 'react-native-device-info';
import API from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This function registers the device that is currently in use with the
// backend API. 
export async function registerDeviceIfNeeded() {
  const deviceId = await DeviceInfo.getUniqueId();
  const deviceName = await DeviceInfo.getDeviceName();
  const deviceType = DeviceInfo.isTablet() ? 'Tablet' : 'Mobile'; // checks if the device is a mobile or tablet

  try { // Checks if the device is already registered.
    const { data: devices } = await API.get('/device/list');
    const alreadyRegistered = devices.some((d: any) => d.id === deviceId);

    if (!alreadyRegistered) { // If it isn't already registered, the registration process is carried out.
      const response = await API.post('/device/register', {
        deviceId,
        deviceName,
        deviceType,
      });

      // A log is returned that confirm that the device has been registered.
      console.log('Device Registered:', response.data);
      await AsyncStorage.setItem('deviceId', deviceId); // Device info stored
    } else { // Otherwise, if device is already registered, an error message will be displayed.
      console.log('Device has already been registered');
    }
  } catch (err: any) { // If there is a different error causing the failure in device registration
    // then this message is displayed
    console.error('Device registration error:', err?.response?.data || err.message);
  }
}