import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import your screens
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import ParentDashboardScreen from './screens/ParentDashboardScreen';
import StoriesScreen from './screens/StoriesScreen';
import StatusScreen from './screens/StatusScreen';
import LibraryScreen from './screens/LibraryScreen';
import ProfileScreen from './screens/ProfileScreen';

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
        <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
        <Stack.Screen name="Stories" component={StoriesScreen} />
        <Stack.Screen name="Status" component={StatusScreen} />
        <Stack.Screen name="Library" component={LibraryScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}