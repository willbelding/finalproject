import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DevicesScreen from './src/screens/DevicesScreen';
import ScanScreen from './src/screens/ScanScreen';
import MalwareDetectedScreen from './src/screens/MalwareDetectedScreen'; // New screen
import CleanScreen from './src/screens/CleanScreen'; // New screen

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}