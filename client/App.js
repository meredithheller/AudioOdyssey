import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './pages/LandingPage';
import HomeContainer from './pages/HomeContainer';
import './global.js';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Constants.platform.ios.model', 'Please report: Excessive number', 'Warning: Each']); 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="Landing">
        <Stack.Screen options={{ headerShown: false }} name="Landing" component={LandingPage} />
        <Stack.Screen options={{ headerShown: false, gestureEnabled: false, headerBackVisible: false }} name="Home" component={HomeContainer}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
