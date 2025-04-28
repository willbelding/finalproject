// This file creates a React Native (native) Module that allows the application to
// calculate the SHA-256 hash value of installed Android APK files.
package com.securityhubagent;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.File;
import java.io.FileInputStream;
import java.security.MessageDigest;

//This declares the module class for APK hashing and extends to the React module
// stated below. 
public class ApkHasherModule extends ReactContextBaseJavaModule {

    // A declaration of a private a final instance to hold the application context.
    private final ReactApplicationContext reactContext;
    // This is a constructor for APKHasherModule that obtains the application context
    // as an input.
    public ApkHasherModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }
    // This is required for React Native (native) modules and returns the module name
    // so JavaScript can access it.
    @Override
    public String getName() {
        return "ApkHasher";
    }
    // This block allows the calling of the getApkSha256 method from the React Native
    // JavaScript code through the addition of the annotation "@ReactMethod". 
    @ReactMethod
    public void getApkSha256(String packageName, Promise promise) {
        try {
            // This begins a try catch block that performs error handling on
            // the process of getting the APK hash.
            PackageManager pm = reactContext.getPackageManager(); // Allows the app to retrieve information about the installed apps on a device
            PackageInfo pkgInfo = pm.getPackageInfo(packageName, 0); // Gains detailed info on package
            ApplicationInfo appInfo = pkgInfo.applicationInfo; // Obtains the package information and finds APK source path  
            String sourceDir = appInfo.sourceDir;

            // This is creates a file that represents the APK file.
            File file = new File(sourceDir);
            if (!file.exists()) { // checks if APK exists in the found path
                // If it doesn't, the promise is rejected along with associated error code and message.
                promise.reject("FILE_NOT_FOUND", "APK not found for: " + packageName);
                return;
            }

            // This obtains an instance of the MessageDigest class for the given algorithm.
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            FileInputStream fis = new FileInputStream(file); // reads the APK file contents 
            byte[] buffer = new byte[8192]; // Reads the file in segments
            int read; // integer variable to store bytes value for each iteration
            // This then reads the file in set segments until the file end is reached.
            while ((read = fis.read(buffer)) > 0) {
                digest.update(buffer, 0, read); // updates messagedigest with data segment
            }
            fis.close();

            // This will then calculate the final hash value as bytes array.
            byte[] hashBytes = digest.digest();
            StringBuilder sb = new StringBuilder(); // Builds hexadecimal representation of hash value
            for (byte b : hashBytes) { // This then iterates through each byte in the array
                sb.append(String.format("%02x", b)); // formats every byte into 2 digit hexa string (appends to string builder)
            }

            // This then resolves the promise by providing calculated hash as a string
            promise.resolve(sb.toString());
        } catch (Exception e) {
            // If any errors occur, then this failure message is logged.
            Log.e("ApkHasher", "Failed to hash the APK for " + packageName, e);
            promise.reject("HASH_ERROR", "Failed to hash the APK: " + e.getMessage(), e);
        }
    }
}