import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import PlanTripPage from './PlanTripPage';
import ProfileContainer from './ProfileContainer';

const Tab = createBottomTabNavigator();

export default function HomeContainer({ navigation, route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Plan Trip') {
            iconName = focused
              ? 'ios-car'
              : 'ios-car-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#003f5c',
        tabBarInactiveTintColor: 'gray'
      })}
    >
      <Tab.Screen options={{headerShown: false}} name="Plan Trip" component={PlanTripPage} />
      <Tab.Screen options={{headerShown: false}} name="Profile" component={ProfileContainer} />
    </Tab.Navigator>
  );
}