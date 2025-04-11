import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import { getInstalledApps } from '../native/InstalledApps';
import API from './api';

type InstalledApp = {
  packageName: string;
  name: string;
  isSystemApp: boolean;
  permissions?: string[];
};

const trustedSystemPackagePrefixes = [
  'com.samsung.',
  'com.android.',
  'android',
  'com.google.android.',
  'com.sec.',
  'com.qualcomm.',
];

const dangerousPermissions = new Set([
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.READ_SMS',
  'android.permission.SEND_SMS',
  'android.permission.READ_CONTACTS',
  'android.permission.WRITE_CONTACTS',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.READ_PHONE_STATE',
  'android.permission.CALL_PHONE',
  'android.permission.SYSTEM_ALERT_WINDOW',
]);

let cachedMalwareSignatures: Set<string> | null = null;

async function getMalwareSignatures(): Promise<Set<string>> {
  if (cachedMalwareSignatures) return cachedMalwareSignatures;
  try {
    const res = await API.get('/malware-signatures');
    cachedMalwareSignatures = new Set(res.data);
    return cachedMalwareSignatures;
  } catch (err: unknown) {
    console.warn('Failed to load malware signatures from backend:', err);
    return new Set();
  }
}

export async function performSecurityScan() {
  const knownMalwarePackages = await getMalwareSignatures();
  console.log('Malware Signatures:', Array.from(knownMalwarePackages));
  const network = await NetInfo.fetch();
  const isEmulator = await DeviceInfo.isEmulator();
  const isTablet = DeviceInfo.isTablet();
  const deviceId = await DeviceInfo.getUniqueId();
  const installedApps = await getInstalledApps() as InstalledApp[];

  console.log("Installed apps found on device:");
  installedApps.forEach(app => {
    console.log(`- ${app.name} (${app.packageName}) [System: ${app.isSystemApp}]`);
  });

  const malware: string[] = [];
  const highRisk: string[] = [];
  const elevatedSystem: string[] = [];
  const userApps: string[] = [];
  const systemApps: string[] = [];

  for (const app of installedApps) {
    const { packageName, name, isSystemApp, permissions = [] } = app;
    const isTrusted = trustedSystemPackagePrefixes.some(prefix =>
      packageName.startsWith(prefix)
    );
    const isMalware = knownMalwarePackages.has(packageName);
    const dangerousCount = permissions.filter(p =>
      dangerousPermissions.has(p)
    ).length;

    const label = `${name} (${packageName})`;

    if (isMalware) {
      malware.push(label);
    }

    if (isSystemApp) {
      systemApps.push(`${label} [System]`);
      if (!isMalware && dangerousCount >= 2 && !isTrusted) {
        elevatedSystem.push(label);
      }
    } else {
      userApps.push(label);
      if (!isMalware && dangerousCount >= 2) {
        highRisk.push(label);
      }
    }
  }

  const scanHealth =
    malware.length > 0
      ? 'Critical'
      : highRisk.length > 0
      ? 'Warning'
      : 'Healthy';

  return {
    deviceId,
    emulator: isEmulator,
    tablet: isTablet,
    networkType: network.type,
    isConnected: network.isConnected,
    malware,
    highRisk,
    elevatedSystem,
    suspiciousApps: [...malware, ...highRisk, ...elevatedSystem],
    scanHealth,
    userApps,
    systemApps,
  };
}