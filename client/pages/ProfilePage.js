import React from 'react';
import { View, Text } from 'react-native';

export default function ProfilePage({ navigation }) {
  return (
    <View>
      <Text onPress={() => {navigation.navigate("Account Settings")}}>Account Settings</Text>
      <Text onPress={() => {navigation.navigate("Upcoming Trips")}}>Upcoming Trips</Text>
      <Text onPress={() => {navigation.navigate("Past Trips")}}>Past</Text>
    </View>
  );
}