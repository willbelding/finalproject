// This file is used to esablish permissions on Android devices.
import { Platform } from 'react-native';
import { check, request, RESULTS, Permission } from 'react-native-permissions';

// This function requests permissions to post nofications on Android devices (13+) 
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || Platform.Version < 33) return true;
  // If device is not Android or the version is below 13, permissions are granted (returns true).

  //Defines specific permission string for Android devices
  const permission = 'android.permission.POST_NOTIFICATIONS' as Permission;

  // Current notification permission status is checked.
  const result = await check(permission);
  if (result === RESULTS.GRANTED) return true; // if permission is already granted, return true

  // If not granted, request from user.
  const requestResult = await request(permission);
  return requestResult === RESULTS.GRANTED; // Return true if user granted permission, return false if not.
}