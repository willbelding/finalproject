// This file is needed to provide a wrapper to access native APKHasher module
// in order to obtain the SHA_256 hash of an APK. 
import { NativeModules } from 'react-native';

// This segment breaks down ApkHasher module from NativeModules
const { ApkHasher } = NativeModules;

// This is an asynchronous function that takes a string as an input that defines the name of
// the android application and returns promise with either a SHA-256 hash string or
// null depending on whether an error occurs.
export const getApkSha256 = async (packageName: string): Promise<string | null> => {
  try {
    // calls the native method from relevant module.
    const hash: string = await ApkHasher.getApkSha256(packageName);
    return hash;
  } catch (error) { // If an error occurs during the call, then an error is displayed.
    console.error(`Error obtaining SHA-256 for ${packageName}:`, error);
    return null;
  }
};