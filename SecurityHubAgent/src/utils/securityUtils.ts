// This file provides the core logic for security scans on HomeGuard Security.
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import { getInstalledApps } from '../native/InstalledApps';
import API from './api';
import { checkVirusTotalHash } from './virusTotalUtils';
import { getApkSha256 } from '../native/ApkHasher';

// This block defines type for installed application information.
type InstalledApp = {
  packageName: string;
  name: string;
  isSystemApp: boolean;
  permissions?: string[];
  sha256?: string | null;
};

// This is an array of prefixes for package names that I have researched to be trusted
// system applications.
const trustedSystemPackagePrefixes = [
  'com.samsung.',
  'com.android.',
  'android',
  'com.google.android.',
  'com.sec.',
  'com.qualcomm.',
];

// This is a set of permissions that I consider dangerous on Android that should
// notify caution with any given app on the device.
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

// This is a declared cache that can store (backend fetched) malware signatures to make sure
// there aren;t any redundant API calls. 
let cachedMalwareSignatures: Set<string> | null = null;

// Fetches the malware signatures (asynchronously) from the backend API.
// they are then cached. If they exist, the cached signatures are returned.
async function getMalwareSignatures(): Promise<Set<string>> {
  if (cachedMalwareSignatures) return cachedMalwareSignatures;
  try { // fetches signatures via backend
    const res = await API.get('/malware-signatures'); // GET request to appropriate endpoint
    cachedMalwareSignatures = new Set(res.data);
    return cachedMalwareSignatures;
  } catch (err: unknown) { // If this process can't be completed, and error message is displayed
    console.warn('Failed to load backend malware signatures:', err);
    return new Set();
  }
}

// This function is used to perform a significant device scan
export async function performSecurityScan(callbacks?: {
  onProgress?: (progress: number) => void; // Callback (optional) to report scan progress
  onAppScan?: (appName: string) => void; // Callback (optional) to report what app is being scanned.
}) {
  const knownMalwarePackages = await getMalwareSignatures(); // Known malware package names from backend are fetched from backend.
  const network = await NetInfo.fetch(); // Network connection information
  const isEmulator = await DeviceInfo.isEmulator(); //Checks if the apps is running through an emulator
  const isTablet = DeviceInfo.isTablet(); // checks if the device is a tablet
  const deviceId = await DeviceInfo.getUniqueId(); // gets unique device id
  const installedApps = (await getInstalledApps() as InstalledApp[]); // gets list of installed apps on device 
  const userInstalledApps = installedApps.filter(app => !app.isSystemApp); // filters apps installed by the user themselves
  const totalApps = userInstalledApps.length; // lists all the apps (user installed )

  const malware: string[] = []; // array to store app names identified as malware
  const highRisk: string[] = []; // array to store app names identified as high risk
  const elevatedSystem: string[] = []; // Array for system apps that have elevated privileges
  const userApps: string[] = []; // Array to store names of apps installed by user
  const systemApps: string[] = []; // Array for system apps.
  let scannedApps = 0; // This is a counter to track the number of apps that have been scanned.

  // This is check that iterates over each user installed app to perform a security check on each of them.
  for (const app of userInstalledApps) {
    const { packageName, name, isSystemApp, permissions = [] } = app;
    callbacks?.onAppScan?.(name);

    // checks if the package name of the app begins with trusted system prefix.
    const isTrusted = trustedSystemPackagePrefixes.some(prefix =>
      packageName.startsWith(prefix)
    );

    // variable that stores the hash (SHA-256) of an APK.
    let sha256: string | null = null;
    try { // tries to get the hash of the app's APK
      sha256 = await getApkSha256(packageName);
      app.sha256 = sha256; // Stores hash in app object
    } catch (error) { // Error handling for failure of hash retrieval
      console.warn(`Failed to get the SHA-256 hash for ${packageName}:`, error);
    }
    if (sha256) { // If scanned app name, package name, and hash are available, it is logged. 
      console.log(`Scanned APK: ${name} (${packageName}) → SHA256: ${sha256}`);
    }

    // This calculates if an app is malware or not.
    const isMalware =
    // Checks if package name matches an entry in the list of known malware
      knownMalwarePackages.has(packageName) ||
      // If the SHA-256 hash is available, it is checked against VirusTotal.
      (sha256 ? await checkVirusTotalHash(sha256) : false);

    // counts how many dangerous permissions a given app has set
    const dangerousCount = permissions.filter(p =>
      dangerousPermissions.has(p)
    ).length;

    const label = `${name} (${packageName})`;

    // This will be carried out if an app is identified as malware.
    if (isMalware) {
      malware.push(label); // app label added to malware array
    } else if (dangerousCount >= 2) { // or if the apps has 2 or more dangerous permissions set
      highRisk.push(label); // app label added to highRisk array
    }

    // app label added to scanned user apps list
    userApps.push(label);
    scannedApps++; // counts the apps that are scanned
    callbacks?.onProgress?.(scannedApps / totalApps); // Calls onProgress callback along with current progress of scan
  }

  // Based on the results of the scan, the health of the device
  // is determined
  const scanHealth =
    malware.length > 0 ? 'Critical' : highRisk.length > 0 ? 'Warning' : 'Healthy';

  return { //This is an obkect that contains all the results of a security scan on a device.
    // Not all are displayed in the finished product due to given feedback on information 
    // overload concerns. But they are still maintained.
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