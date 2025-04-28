package com.securityhubagent;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.io.FileInputStream;
import java.io.InputStream;
import java.security.MessageDigest;
import java.util.List;

// This module (native) enables installed app information on Android devices to be retrieved.
public class InstalledAppsModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public InstalledAppsModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "InstalledApps"; // The name of the native module is returned for JavaScript accessibility
    }

    @ReactMethod
    public void getInstalledApps(Promise promise) {
        try { // Within this block of code, installed package list is retrieved along
              // with extra details through the user of Android's package manager.
            PackageManager pm = reactContext.getPackageManager();
            List<PackageInfo> packages = pm.getInstalledPackages(PackageManager.GET_PERMISSIONS);
            String ownPackage = reactContext.getPackageName();

            WritableArray result = Arguments.createArray();

            for (PackageInfo pkg : packages) { // This block creates a loop that iterates through each installed package.
                ApplicationInfo appInfo = pkg.applicationInfo;
                if (!appInfo.enabled || pkg.packageName.equals(ownPackage)) continue; // extracts relevant info

                WritableMap map = Arguments.createMap(); // formats this data into writeable map.
                map.putString("packageName", pkg.packageName);
                map.putString("name", pm.getApplicationLabel(appInfo).toString());
                map.putBoolean("isSystemApp", (appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0);

                WritableArray permissionsArray = Arguments.createArray();
                if (pkg.requestedPermissions != null) {
                    for (String permission : pkg.requestedPermissions) {
                        permissionsArray.pushString(permission);
                    }
                }
                map.putArray("permissions", permissionsArray);

                String apkPath = appInfo.sourceDir;
                map.putString("apkPath", apkPath);

                String sha256 = computeSHA256(apkPath);
                map.putString("sha256", sha256);

                result.pushMap(map);
            }

            promise.resolve(result); // This block is needed for promise resolution through installed app information array
        } catch (Exception e) { // If installed apps can't be reached, then these errors are displayed.
            Log.e("InstalledApps", "Failed to list installed apps", e);
            promise.reject("ERR_APPS", "Failed to retrieve installed apps", e); // Promise is rejected with error code/message
        }
    }

    private String computeSHA256(String filePath) {
        // Needed to read APK file and compute the SHA-256 hash value
        try (InputStream is = new FileInputStream(filePath)) {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int read;
            while ((read = is.read(buffer)) > 0) {
                digest.update(buffer, 0, read);
            }
            byte[] hash = digest.digest();

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString(); // The hash value is returned as hexadecimal string
        } catch (Exception e) { // Handling exceptions during hash value computation
            Log.e("Hash", "Failed to calculate hash value for: " + filePath, e);
            return "";
        }
    }
}