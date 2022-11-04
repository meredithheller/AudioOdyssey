import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecentTripsPage from './RecentTripsPage';
import AccountSettings from './AccountSettings';
import UpcomingTripsPage from './UpcomingTripsPage';
import PastTripsPage from './PastTripsPage';

const Stack = createNativeStackNavigator();

export default function ProfileContainer() {
  return (
    <Stack.Navigator  initialRouteName="Recent Trips">
      <Stack.Screen options={{ title: 'Recent Trips' }} name="Recent Trips" component={RecentTripsPage}></Stack.Screen>
    </Stack.Navigator>
  );
}