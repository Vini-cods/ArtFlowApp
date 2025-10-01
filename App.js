import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Import your screens
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';

// Temporary placeholder screens until you create the actual files
const LoadingScreen = ({ navigation, route }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Loading Screen</Text>
    <Text style={styles.messageText}>{route?.params?.message || 'Loading...'}</Text>
    <TouchableOpacity
      style={styles.placeholderButton}
      onPress={() => navigation.navigate('Login')}
    >
      <Text style={styles.buttonText}>Go to Login</Text>
    </TouchableOpacity>
  </View>
);

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#0f0820" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0820',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  messageText: {
    color: '#ffd700',
    fontSize: 16,
    marginBottom: 20,
  },
  placeholderButton: {
    backgroundColor: '#6b2fa0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});