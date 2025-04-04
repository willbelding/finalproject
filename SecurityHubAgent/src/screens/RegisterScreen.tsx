import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { register } from '../utils/auth';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      await register(email, password);
      navigation.navigate('Devices');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Register" onPress={handleRegister} />
      <Text>{error}</Text>
    </View>
  );
}