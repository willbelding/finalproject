package com.securityhubagent;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

// This class is requried to register the InstalledAppsModule with the
// React Native framework and make it accessible for JavaScript.
public class InstalledAppsPackage implements ReactPackage {
    // This method is created to be called by React Native in order to
    // declare native module instances that are issued by the package.  
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull com.facebook.react.bridge.ReactApplicationContext reactContext) {
        // An array list that holds the instances of native modules.
        List<NativeModule> modules = new ArrayList<>();
        // Creating new instance of the module and passing context to its constructor,
        // This enables the native module to work with the application context (Android).
        modules.add(new InstalledAppsModule(reactContext));
        return modules;
    }

    // A method to create custom native UI component instances given by the package. 
    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull com.facebook.react.bridge.ReactApplicationContext reactContext) {
        // In this instance, there are no custom native UI components. So an empty list is returned.
        return Collections.emptyList();
    }
}