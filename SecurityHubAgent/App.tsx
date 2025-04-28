import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import MalwareDetectedScreen from './src/screens/MalwareDetectedScreen';
import CleanScreen from './src/screens/CleanScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import ScanHistoryScreen from './src/screens/ScanHistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ScanSettingsScreen from './src/screens/ScanSettingsScreen';
import ColourSchemeScreen from './src/screens/ColourSchemeScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { theme } = useThemeContext();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Malware Found" component={MalwareDetectedScreen} />
        <Stack.Screen name="Scan Results" component={CleanScreen} />
        <Stack.Screen name="About Us" component={AboutUsScreen} />
        <Stack.Screen name="Scan History" component={ScanHistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Scan Settings" component={ScanSettingsScreen} />
        <Stack.Screen name="Colour Scheme" component={ColourSchemeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}