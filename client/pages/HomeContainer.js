import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import ProfileContainer from './ProfileContainer';
import TripStackNavigator from './TripStack';

const Tab = createBottomTabNavigator();

export default function HomeContainer({ navigation, route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Trip Stack') {
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
      <Tab.Screen options={{headerShown: false, title: "Plan Trip"}} name="Trip Stack" component={TripStackNavigator} />
      <Tab.Screen initialParams={ route.params } options={{headerShown: false}} name="Profile" component={ProfileContainer} />
    </Tab.Navigator>
  );
}