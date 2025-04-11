package com.securityhubagent;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DeleteAppsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public DeleteAppsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "DeleteApps";
    }

    @ReactMethod
    public void uninstallApp(String packageName) {
        try {
            Intent intent = new Intent(Intent.ACTION_DELETE);
            intent.setData(Uri.parse("package:" + packageName));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            Activity currentActivity = getCurrentActivity();
            if (currentActivity != null) {
                Log.i("DeleteAppsModule", "Launching uninstall for: " + packageName + " via currentActivity");
                currentActivity.startActivity(intent);
            } else {
                Log.w("DeleteAppsModule", "currentActivity was null. Falling back to applicationContext.");
                reactContext.startActivity(intent);
            }
        } catch (Exception e) {
            Log.e("DeleteAppsModule", "Failed to uninstall " + packageName, e);
        }
    }
}