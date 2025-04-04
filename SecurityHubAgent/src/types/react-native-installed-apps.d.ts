declare module 'react-native-installed-apps' {
    export interface AppInfo {
      appName: string;
      packageName: string;
      versionName: string;
      versionCode: number;
      apkDir: string;
      icon?: string;
    }
  
    const InstalledApps: {
      getApps(): Promise<AppInfo[]>;
      getNonSystemApps(): Promise<AppInfo[]>;
      getSystemApps(): Promise<AppInfo[]>;
    };
  
    export default InstalledApps;
  }