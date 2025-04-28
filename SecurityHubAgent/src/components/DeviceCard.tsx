// This file is needed to show the device information for scans.
import React from 'react';
import { View, Text } from 'react-native';

// Device Card component is declared where the device prop of
// type 'any' is recieved
export default function DeviceCard({ device }: any) {
  return (
    <View>
      {/* text components displating deviceId and scanHealth */}
      <Text>{device.deviceId}</Text>
      <Text>{device.scanHealth}</Text>
    </View>
  );
}