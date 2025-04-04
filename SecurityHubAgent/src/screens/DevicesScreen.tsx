import React, { useEffect, useState } from 'react';
import { View, FlatList, Button } from 'react-native';
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
    const res = await API.get('/devices');
    setDevices(res.data);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <View>
      <Button title="Logout" onPress={() => { logout(); navigation.navigate('Login'); }} />
      <FlatList
        data={devices}
        renderItem={({ item }) => <DeviceCard device={item} />}
        keyExtractor={(item) => item.id}
      />
      <Button title="Scan This Device" onPress={() => navigation.navigate('Scan')} />
    </View>
  );
}