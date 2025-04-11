import PushNotification from 'react-native-push-notification';

export const setupNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'security-scan', 
      channelName: 'Security Scan Notifications',
      importance: 4,
      vibrate: true,
    },
    (created: boolean) => {
      console.log(`Notification channel '${created ? 'created' : 'already exists'}'`);
    }
  );
};

export const notifyScanResult = (status: string, malwareCount: number) => {
  PushNotification.localNotification({
    channelId: 'security-scan',
    title: 'Security Scan Finished',
    message: `Status: ${status}. Malware found: ${malwareCount}`,
    playSound: true,
    soundName: 'default',
  });
};