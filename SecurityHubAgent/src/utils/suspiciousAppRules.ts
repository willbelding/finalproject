// This file sets some custom rules for detecting malware and unsecure permission settings.
export const knownMalwarePackages = [
  ];
  
  export const suspiciousKeywords = [
  ];
  
  export const dangerousPermissions = [
    'android.permission.READ_SMS',
    'android.permission.RECEIVE_SMS',
    'android.permission.SEND_SMS',
    'android.permission.READ_CONTACTS',
    'android.permission.RECORD_AUDIO',
    'android.permission.READ_CALL_LOG',
    'android.permission.WRITE_CALL_LOG',
    'android.permission.CAMERA',
  ];