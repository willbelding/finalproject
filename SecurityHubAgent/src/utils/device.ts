import DeviceInfo from 'react-native-device-info';
import API from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function registerDeviceIfNeeded() {
  const deviceId = await DeviceInfo.getUniqueId();
  const deviceName = await DeviceInfo.getDeviceName();
  const deviceType = DeviceInfo.isTablet() ? 'Tablet' : 'Mobile';

  try {
    const { data: devices } = await API.get('/device/list');
    const alreadyRegistered = devices.some((d: any) => d.id === deviceId);

    if (!alreadyRegistered) {
      const response = await API.post('/device/register', {
        deviceId,
        deviceName,
        deviceType,
      });

      console.log('Device registered:', response.data);
      await AsyncStorage.setItem('deviceId', deviceId);
    } else {
      console.log('Device already registered');
    }
  } catch (err: any) {
    console.error('Device registration error:', err?.response?.data || err.message);
  }
}