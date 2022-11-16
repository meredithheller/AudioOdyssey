import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfilePage from './ProfilePage';
import AccountSettings from './AccountSettings';
import UpcomingTripsPage from './UpcomingTripsPage';
import PastTripsPage from './PastTripsPage';

const Stack = createNativeStackNavigator();

export default function ProfileContainer() {
  return (
    <Stack.Navigator  initialRouteName="Profile Home">
      <Stack.Screen options={{ title: 'Profile' }} name="Profile Home" component={ProfilePage}></Stack.Screen>
      <Stack.Screen name="Account Settings" component={AccountSettings}></Stack.Screen>
      <Stack.Screen name="Upcoming Trips" component={UpcomingTripsPage}></Stack.Screen>
      <Stack.Screen name="Past Trips" component={PastTripsPage}></Stack.Screen>
    </Stack.Navigator>
  );
}