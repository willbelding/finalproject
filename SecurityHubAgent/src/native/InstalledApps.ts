import { NativeModules } from 'react-native';

const { InstalledApps } = NativeModules;

export async function getInstalledApps(): Promise<{ packageName: string }[]> {
  try {
    const result = await InstalledApps.getInstalledApps();
    return result;
  } catch (error) {
    console.error('Failed to fetch installed apps:', error);
    return [];
  }
}