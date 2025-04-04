import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import { getInstalledApps } from '../native/InstalledApps';
import {
  knownMalwarePackages,
  suspiciousKeywords,
  dangerousPermissions,
} from './suspiciousAppRules';

export async function performSecurityScan() {
  const network = await NetInfo.fetch();
  const isEmulator = await DeviceInfo.isEmulator();
  const isTablet = DeviceInfo.isTablet();
  const deviceId = await DeviceInfo.getUniqueId();

  const installedApps = await getInstalledApps();

  const flaggedApps = installedApps.filter((app: any) => {
    const pkg = app.packageName?.toLowerCase() || '';
    const name = app.name?.toLowerCase() || '';
    const perms: string[] = app.permissions || [];

    const matchesMalware = knownMalwarePackages.includes(pkg);
    const matchesKeyword = suspiciousKeywords.some(keyword =>
      pkg.includes(keyword) || name.includes(keyword)
    );
    const hasDangerousPerms = perms.some(p =>
      dangerousPermissions.includes(p)
    );
    const isRiskySystemApp = app.isSystemApp && hasDangerousPerms;

    return matchesMalware || matchesKeyword || isRiskySystemApp;
  });

  return {
    deviceId,
    emulator: isEmulator,
    tablet: isTablet,
    networkType: network.type,
    isConnected: network.isConnected,
    suspiciousApps: flaggedApps,
    scanHealth:
      flaggedApps.length > 0 || isEmulator ? 'Warning' : 'Healthy',
  };
}