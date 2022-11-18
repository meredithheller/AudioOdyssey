import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfilePage from './ProfilePage';
import AccountSettings from './AccountSettings';
import CurrentTripPage from './CurrentTripPage';
import PastTripsPage from './PastTripsPage';

const Stack = createNativeStackNavigator();

export default function ProfileContainer() {
  return (
    <Stack.Navigator  
      initialRouteName="Profile Home"
      screenOptions={{
        headerTintColor: '#003f5c',
        headerTitleStyle: {
          color: "#003f5c"
        }}}>
      <Stack.Screen initialParams={ route.params } options={{ title: 'Profile' }} name="Profile Home" component={ProfilePage}></Stack.Screen>
      <Stack.Screen initialParams={ route.params } name="Account Settings" component={AccountSettings}></Stack.Screen>
      <Stack.Screen name="Current Trip" component={CurrentTripPage}></Stack.Screen>
      <Stack.Screen name="Past Trips" component={PastTripsPage}></Stack.Screen>
    </Stack.Navigator>
  );
}