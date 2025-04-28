// This file also provides a wrapper, but for the native installedApps module in order
// to obtain a list of installed apps on a device.
import { NativeModules } from 'react-native';

const { InstalledApps } = NativeModules;

// This function is designed to find a list of installed apps on a device.
// It resolves to an array of objects that each contain the package name of the app.
export async function getInstalledApps(): Promise<{ packageName: string }[]> {
  try { // This calls the native function from the InstalledApps module.
    const result = await InstalledApps.getInstalledApps();
    return result; // if call is successful, the result is returned (Promise resolved). 
  } catch (error) {
    // Otherwise, an error message is displayed.
    console.error('Failed to fetch installed apps on device:', error);
    return [];
  }
}