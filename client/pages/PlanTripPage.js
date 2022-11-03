import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PlanTripPage() {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text>Plan Trip</Text>
      <Text>Where are you departing from?</Text>
      <TextInput
        style={styles.TextInput}
        placeholder="Address"
        placeholderTextColor="#003f5c"
        //onChangeText={}
      />
      <Text>What is your final destination?</Text>
      <TextInput 
        style={styles.TextInput}
        placeholder="Address"
        placeholderTextColor="#003f5c"
        //onChangeText={}
      />
      <Text>Would you like to make any stops?</Text>

      <Text>What sort of podcasts are you interested in listening to?</Text>

      <TouchableOpacity>
        <Text>Plan my trip!</Text>
      </TouchableOpacity>
    </View>
  );
}