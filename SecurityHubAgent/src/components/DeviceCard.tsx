import React from 'react';
import { View, Text } from 'react-native';

export default function DeviceCard({ device }: any) {
  return (
    <View>
      <Text>{device.deviceId}</Text>
      <Text>{device.scanHealth}</Text>
    </View>
  );
}