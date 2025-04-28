// This file is needed to trigger local push notifications on scan results
// of a device. 
import PushNotification from 'react-native-push-notification';

// Function to create notif channel for scans alerts in Android.
export const setupNotificationChannel = () => {
  PushNotification.createChannel(
    { // Objects in config of notification channel
      channelId: 'security-scan', 
      channelName: 'Security Scan Notifications',
      importance: 4,
      vibrate: true,
    },
    (created: boolean) => { // This executes callback function after channel creation attempt 
      console.log(`Notification Channel '${created ? 'created' : 'already exists'}'`);
    }
  );
};

// Function to display local notification with scan results. 
export const notifyScanResult = (status: string, malwareCount: number) => {
  PushNotification.localNotification({ // Calls local method to display notification 
    channelId: 'security-scan',
    title: 'Security Scan Finished',
    message: `Status: ${status}. Malware found: ${malwareCount}`, //display result of scan
    playSound: true, // enables sound feedback when notification displayed
    soundName: 'default',
  });
};