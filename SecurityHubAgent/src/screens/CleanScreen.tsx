import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const CleanScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NO MALWARE DETECTED</Text>
      <Text style={styles.message}>Your device is clean and safe.</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Devices')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
  },
  message: {
    fontSize: 16,
    marginVertical: 20,
  },
});

export default CleanScreen;