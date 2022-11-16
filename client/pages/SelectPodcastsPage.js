import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import PodcastChoice from '../components/podcastChoice';
import TripCard from '../components/tripCard'

export default function SelectPodcastsPage({ navigation, route }) {

  const [selectedId, setSelectedId ] = useState()
  const [ loading, setLoading ] = useState(true)
  const [ tripPossibilities, setTripPossibilities ] = useState([1, 2, 3])
  const [ selectedTrip, setSelectedTrip ] = useState()

  useEffect(() => {
    console.log(route.params.startLocation)
    console.log(route.params.endLocation)
    // load all podcast info then set loading to false
    // something like route.params.podcasts get each podcast's info within each array
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, [])

  const onSelectTrip = (id) => {
    console.log("here")
    setSelectedTrip(id)
  }


  const handleSaveTrip = () => {
    console.log(selectedTrip)
    if(selectedTrip == null){
      alert('Please select a trip option to proceed.')
    }
  //   console.log("here")
  //   console.log(route.params.podcasts)
  //   if(!route.params.podcasts.includes(selectedId)){
  //     alert("Enter a valid podcast id")
  //   }else{
  //     navigation.navigate('Plan Trip')
  //     const response = fetch('http://db8.cse.nd.edu:5006/saveTrip', {
  //     method: 'POST',
  //     headers: {
  //     'Content-Type': 'application/json'
  //   },
  //     body: JSON.stringify({
  //     start: route.params.startLocation,
  //     stop: route.params.endLocation,
  //     episode_uri: selectedId
  //   })
  //   }).then((response) => {
  //   if(response.ok){
  //   console.log(`this worked`)
  //   }}
  //   ).catch((e) => {
  //     console.log(e.response);
  //   });
  // }
  //   // 2nd endpoint: add the trip id, episode uri, and a rating of 0 to the trip_rating table
  }

  return (
    loading? <SafeAreaView style={{backgroundColor: 'lightblue', width: '100%', height: '100%'}}>
      <Text style={styles.header}>Select Podcasts</Text>
      <ActivityIndicator size="large" style={styles.loading}/> 
      </SafeAreaView>: 
    <View style={{backgroundColor: 'lightblue', width: '100%', height: '100%'}}>
    <SafeAreaView>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: 'center'}}
        showsVerticalScrollIndicator={true} 
        persistentScrollbar={true}>
        <Text style={styles.header}>Select Podcasts</Text>
        { tripPossibilities.map((trip, index) => {
                return (
                  <TripCard canEdit={true} key={index} tripNum={index} onSelectTrip={onSelectTrip} tripInfo={[1, 2, 3, 5]} selected={selectedTrip == index}/>
                )
            })}
      </ScrollView>
      <Pressable 
        style={styles.button} 
        onPress={() => {
          handleSaveTrip()
        }}>
            <Text style={styles.buttonText} onPress={() => handleSaveTrip()}>Save Trip</Text>
      </Pressable>
    </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
    loading : {
      alignSelf: 'center',
    },
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
        width: 200,
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
        paddingTop: 10,
        alignSelf: 'center'
      },
      container: {
        height: '100%'
      }

})