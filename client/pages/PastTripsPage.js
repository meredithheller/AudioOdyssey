import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PastTripsPage() {
  return (
    <View>
      <Text>Past Trips</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    height: '100%', 
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    color: 'black',
    fontWeight: 'bold',
    letterSpacing: 0.25,
    textTransform: 'uppercase',
    fontSize: 24,
    paddingTop: 10
  }
});