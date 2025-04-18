import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ColourSchemeScreen() {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemScheme || 'light');

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') setTheme(stored);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
      <Text style={[styles.label, theme === 'dark' ? styles.darkText : styles.lightText]}>
        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </Text>
      <Switch
        value={theme === 'dark'}
        onValueChange={toggleTheme}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  light: {
    backgroundColor: '#fff',
  },
  dark: {
    backgroundColor: '#000',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
});