// This file provides native functionality to uninstall applications
// from an Android device through the application. 

package com.securityhubagent;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

// Delete apps module class is declared and extends to ReactContextBaseJavaModule to
// make it accessible for JavaScript.
public class DeleteAppsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    // This is a constructor for the module, taking application context as an input.
    public DeleteAppsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    // This block is a method that returns the module name for JavaScript access
    @NonNull
    @Override
    public String getName() {
        return "DeleteApps";
    }

    // This allows the uninstallApp method to be called from JavaScript code
    // (using @ReactMethod) 
    @ReactMethod
    public void uninstallApp(String packageName) {
        // This creates a try catch block to handle errors in the delete app module
        // process.
        try {
            //  Creates new intent using ACTION_DELETE. Signalling the system to uninstall
            // the given package. 
            Intent intent = new Intent(Intent.ACTION_DELETE);
            intent.setData(Uri.parse("package:" + packageName)); // sets intent data using Uri to specify which package to uninstall 
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // starts new uninstall activity task.

            // Retrieves the exisiting foregrounf activity.
            Activity currentActivity = getCurrentActivity();
            if (currentActivity != null) { // Checks if an activity is available 
                // If so, log message indicating the start of uninstall intent and start the activity
                // that initiates the uninstallation process. 
                Log.i("DeleteAppsModule", "Starting uninstall for: " + packageName + " via currentActivity");
                currentActivity.startActivity(intent);
            } else { // Otherwise, log an error message and go back to launching the activity using
                // the application context.
                Log.w("DeleteAppsModule", "currentActivity was null. Falling back to applicationContext.");
                reactContext.startActivity(intent);
            }
        } catch (Exception e) { // If an exception occurs, display an error message detailing the
            // name of the module and package along with the details of the exception.
            Log.e("DeleteAppsModule", "Failed to uninstall " + packageName, e);
        }
    }
}