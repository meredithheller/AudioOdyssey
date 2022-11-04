import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import PodcastChoice from '../components/podcastChoice';

export default function SelectPodcastsPage({ navigation, route }) {

  const [selectedId, setSelectedId ] = useState()

  useEffect(() => {
  }, [])


  const handleSaveTrip = () => {
    if(!route.params.podcasts.includes(Number(selectedId))){
      alert("Enter a valid podcast id")
    }else{
      navigation.navigate('Plan Trip')
    }
    // here make requests to our python server to save the trip information
    // if successful, return to new trip page
    // otherwise, show error and remain here
      // EXECUTE A FEW ENDPOINTS: 
        // 1st endpoint: access the value in total_trips and increment it, and insert the trip id, start and stop locations, and date it was created to the trip_info table
        // 2nd endpoint: add the trip id, episode uri, and a rating of 0 to the trip_rating table
  }

  return (
    <View style={{backgroundColor: 'lightblue', width: '100%', height: '100%'}}>
    <SafeAreaView>
      <ScrollView style={styles.container} contentContainerStyle={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: 'center'}}>
        <Text style={styles.header}>Select Podcasts</Text>
        { route.params.podcasts.map((id) => {
                return (
                  <PodcastChoice key={id} id={id}/>
                )
            })}
            <TextInput
        style={styles.input}
        onChangeText={(val) => setSelectedId(val)}
        value={selectedId}
        placeholder="enter podcast id"
        keyboardType="numeric"
      />
      </ScrollView>
      <Pressable 
        style={styles.button} 
        onPress={() => {
          handleSaveTrip()
        }}>
            <Text style={styles.buttonText}>Save Trip</Text>
      </Pressable>
    </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
    input : {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      borderColor: 'white'
    },
    button: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
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
      },
      header: {
        color: 'black',
        fontWeight: 'bold',
        letterSpacing: 0.25,
        textTransform: 'uppercase',
        fontSize: 24,
        paddingTop: 10
      },
      container: {
        height: '95%'
      }

})