// This is the design of my About Us page.
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// This establishes the them based upon the theme that is toggled.
import { useTheme } from '@react-navigation/native';

// Using the default theme (light mode)
export default function AboutUsScreen() {
  const { colors } = useTheme();

  // This is the content of my About Us page.
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Welcome to HomeGuard Security!</Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        If you want to protect this device from being infected with any nasty viruses, then the HomeGuard Security Scanner companion app is the tool for you!
      </Text>
      <Text style={[styles.paragraph, { color: colors.text }]}>
        This app offers variety of features, including real-time scan reports, customised automated scans, and notifications of any found viruses on your device.
        
        If you want a centralised platform to view the security status of all your home devices, why not sign in to our dedicated HomeGuard Security Dashboard. You will be able to view the security status of all your devices in one place in real-time! 
      
        Just make sure you have the app installed on all your devices so automated scans can be run!
      </Text>
    </ScrollView>
  );
}

// Some basic styling of the page including container size, title font weight, and text font size. 
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
});