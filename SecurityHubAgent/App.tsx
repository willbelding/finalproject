import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DevicesScreen from './src/screens/DevicesScreen';
import ScanScreen from './src/screens/ScanScreen';
import MalwareDetectedScreen from './src/screens/MalwareDetectedScreen';
import CleanScreen from './src/screens/CleanScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import ScanHistoryScreen from './src/screens/ScanHistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ScanSettingsScreen from './src/screens/ScanSettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Devices" component={DevicesScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="MalwareDetectedScreen" component={MalwareDetectedScreen} />
        <Stack.Screen name="CleanScreen" component={CleanScreen} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} />
        <Stack.Screen name="ScanHistory" component={ScanHistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ScanSettings" component={ScanSettingsScreen} options={{ title: 'Scan Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}