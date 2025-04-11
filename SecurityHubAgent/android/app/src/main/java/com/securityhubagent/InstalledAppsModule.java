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

import java.util.List;

public class InstalledAppsModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public InstalledAppsModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "InstalledApps";
    }

    @ReactMethod
    public void getInstalledApps(Promise promise) {
        try {
            PackageManager pm = reactContext.getPackageManager();
            List<PackageInfo> packages = pm.getInstalledPackages(PackageManager.GET_PERMISSIONS);

            String ownPackage = reactContext.getPackageName();
            WritableArray result = Arguments.createArray();

            for (PackageInfo pkg : packages) {
                ApplicationInfo appInfo = pkg.applicationInfo;

                if (!appInfo.enabled) continue;

                if (pkg.packageName.equals(ownPackage)) continue;

                WritableMap map = Arguments.createMap();
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

                Log.d("InstalledApps", "Detected: " + pkg.packageName + " (" + appInfo.loadLabel(pm) + ")");

                result.pushMap(map);
            }

            promise.resolve(result);
        } catch (Exception e) {
            Log.e("InstalledApps", "Failed to list apps", e);
            promise.reject("ERR_APPS", "Failed to get installed apps", e);
        }
    }
}