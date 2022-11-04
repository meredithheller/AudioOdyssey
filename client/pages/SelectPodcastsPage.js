import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import PodcastChoice from '../components/podcastChoice';

export default function SelectPodcastsPage({ navigation, route }) {

  const [selectedId, setSelectedId ] = useState()

  useEffect(() => {
    console.log(route.params.startLocation)
    console.log(route.params.endLocation)
  }, [])


  const handleSaveTrip = () => {
    console.log("here")
    console.log(route.params.podcasts)
    if(!route.params.podcasts.includes(selectedId)){
      alert("Enter a valid podcast id")
    }else{
      navigation.navigate('Plan Trip')
      const response = fetch('http://db8.cse.nd.edu:5001/saveTrip', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({
      start: route.params.startLocation,
      stop: route.params.endLocation,
      episode_uri: selectedId
    })
    }).then((response) => {
    if(response.ok){
    console.log(`this worked`)
    }}
    ).catch((e) => {
      console.log(e.response);
    });
  }
    // 2nd endpoint: add the trip id, episode uri, and a rating of 0 to the trip_rating table
  }

  return (
    <View style={{backgroundColor: 'lightblue', width: '100%', height: '100%'}}>
    <SafeAreaView>
      <ScrollView style={styles.container} contentContainerStyle={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: 'center'}}>
        <Text style={styles.header}>Select Podcasts</Text>
        { route.params.podcasts.map((uri) => {
                return (
                  <PodcastChoice key={uri} uri={uri}/>
                )
            })}
            <TextInput
        style={styles.input}
        onChangeText={(val) => setSelectedId(val)}
        value={selectedId}
        placeholder="enter podcast id"
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
        bottom: -30,
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