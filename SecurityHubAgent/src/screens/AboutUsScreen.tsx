import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AboutUsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About SecurityHub</Text>
      <Text style={styles.paragraph}>
        SecurityHub is a personal cybersecurity application designed to scan and monitor mobile phones, tablets, laptops, and computers.
        It empowers users to detect malware, identify suspicious applications, and take corrective actions to protect their devices.
      </Text>
      <Text style={styles.paragraph}>
        Features include real-time scan reports, automated scheduled scans, notifications for risks, and a secure platform to manage all devices linked to a single account.
        It’s your all-in-one tool for home device protection.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
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