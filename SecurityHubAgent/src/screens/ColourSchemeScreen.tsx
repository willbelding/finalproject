// This file is needed to esablish the colour scheme of the app.
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

// The exports the colour scheme to the app and creates the toggle.
export default function ColourSchemeScreen() {
  const { isDark, toggleTheme } = useThemeContext();

  // This carries out a check on whether the theme in use is the dark mode.
  // If it is, the elements are changed (for example background to black).
  // Otherwise, elements are kept to defaukt (light mode).
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 18, marginBottom: 10 }}>
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </Text>
      <Switch value={isDark} onValueChange={toggleTheme} />
    </View>
  );
}

// This esablishes where the toggle will be situated on the sceen.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});