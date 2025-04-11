import { Platform } from 'react-native';
import { check, request, RESULTS, Permission } from 'react-native-permissions';

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || Platform.Version < 33) return true;

  const permission = 'android.permission.POST_NOTIFICATIONS' as Permission;

  const result = await check(permission);
  if (result === RESULTS.GRANTED) return true;

  const requestResult = await request(permission);
  return requestResult === RESULTS.GRANTED;
}
