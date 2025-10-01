import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

// Import das telas
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import TransitionScreen from './screens/TransitionScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

// Componente de Fallback caso alguma tela não carregue
function FallbackScreen({ message }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0820' }}>
      <Text style={{ color: '#ffd700', fontSize: 18 }}>{message}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer
      fallback={<FallbackScreen message="Carregando ArtFlow..." />}
    >
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Transition" component={TransitionScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}