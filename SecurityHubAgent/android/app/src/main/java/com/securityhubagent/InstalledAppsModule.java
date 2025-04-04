package com.securityhubagent;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
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
            WritableArray result = Arguments.createArray();

            for (PackageInfo pkg : packages) {
                ApplicationInfo appInfo = pkg.applicationInfo;

                WritableMap map = Arguments.createMap();
                map.putString("packageName", pkg.packageName);
                map.putString("name", pm.getApplicationLabel(appInfo).toString());
                map.putBoolean("isSystemApp", (appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0);

                // Permissions
                WritableArray permissionsArray = Arguments.createArray();
                if (pkg.requestedPermissions != null) {
                    for (String permission : pkg.requestedPermissions) {
                        permissionsArray.pushString(permission);
                    }
                }
                map.putArray("permissions", permissionsArray);

                result.pushMap(map);
            }

            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("ERR_APPS", "Failed to get installed apps", e);
        }
    }
}

