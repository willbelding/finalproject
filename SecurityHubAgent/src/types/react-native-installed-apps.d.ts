// This file states type definitions and allows TypeScript to understand
// what is provided by this native module. 
declare module 'react-native-installed-apps' {
  // This is what is returned for each application that is found  
  export interface AppInfo {
      appName: string;
      packageName: string;
      versionName: string;
      versionCode: number;
      apkDir: string;
      icon?: string;
    }
  
    // States the constant object to represent the native module that can be
    // accessed in JavaScript.
    const InstalledApps: {
      getApps(): Promise<AppInfo[]>; // Obtains information for installed apps on device
      getNonSystemApps(): Promise<AppInfo[]>; // Obtains information on user installed apps
      getSystemApps(): Promise<AppInfo[]>; // Obtains information on system installed apps
    };
    export default InstalledApps;
  }