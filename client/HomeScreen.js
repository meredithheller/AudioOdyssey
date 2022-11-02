import { Text, View } from 'react-native';
import React from 'react';

export default function HomeScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome {route.params.name }!</Text>
    </View>
  );
}