import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';

export default function SelectPodcastsPage({ navigation, route }) {
  return (
    <SafeAreaView>
      <Text>Select Podcasts</Text>
      <Pressable style={styles.button} onPress={()=>{navigation.navigate("Plan Trip", { })}}>
          <Text style={styles.buttonText}>Save Trip</Text>
        </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        margin: 10
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 0.25,
        textTransform: 'uppercase'
      }
})