import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet } from 'react-native';
import API from '../utils/api';
import { logout } from '../utils/auth';
import DeviceCard from '../components/DeviceCard';

type Device = {
  id: string;
  deviceId: string;
  scanHealth: string;
};

export default function DevicesScreen({ navigation }: any) {
  const [devices, setDevices] = useState<Device[]>([]);

  const fetchDevices = async () => {
    try {
      const res = await API.get('/device/list');
      setDevices(res.data);
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <FlatList
        data={devices}
        renderItem={({ item }) => <DeviceCard device={item} />}
        keyExtractor={(item) => item.id}
      />
      <Button title="Scan This Device" onPress={() => navigation.navigate('Scan')} />
      <Button title="About Us" onPress={() => navigation.navigate('AboutUs')} />
      <Button title="Scan History" onPress={() => navigation.navigate('ScanHistory')} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
});