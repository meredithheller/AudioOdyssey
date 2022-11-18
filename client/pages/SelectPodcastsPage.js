import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import PodcastChoice from '../components/podcastChoice';
import TripCard from '../components/tripCard'

export default function SelectPodcastsPage({ navigation, route }) {

  const [selectedId, setSelectedId ] = useState()
  const [ loading, setLoading ] = useState(true)
  const [ tripPossibilities, setTripPossibilities ] = useState([])
  const [ selectedTrip, setSelectedTrip ] = useState()

  useEffect(() => {
    setLoading(true)
    if(!tripPossibilities){
      alert("there was an error")
      navigation.navigate('Plan Trip')
    }
    // console.log("IN SLECT PODCASTS PAGE WE HAVE: ")
    // console.log(route.params.trips)
    setTripPossibilities(route.params.trips)
    setLoading(false)
  }, [])

  const onSelectTrip = (id) => {
    console.log(id)
    setSelectedTrip(id)
  }


  const handleSaveTrip = () => {
    // console.log(selectedTrip)
    if(selectedTrip == null){
      alert('Please select a trip option to proceed.')
    }else{
      console.log(tripPossibilities[selectedTrip])
      // TODO: THIS IS WHERE WE NEED TO MAKE POST REQUEST TO SAVE THE TRIP
      // WHAT NEEDS TO HAPPEN ON SAVE TRIP? 
        // generate a trip id, save trip id, username, trip, start and stop location, and date created to trip_info
        // 
    }
  }

  const onReplace = (podcastIndex, tripIndex) => {
    // TODO: make API call to replace the podcast
      // IN THIS CALL: get a new podcast of similar length from the categories that hasn't been listened to or replaced already
      // ALSO IN THIS CALL: add to the history that user replaced this podcast so we don't show in the future (probably do this first)
    // update the trip options array with new podcast in correct trip option

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
    ( loading || !tripPossibilities ) ? <SafeAreaView style={{backgroundColor: 'lightblue', width: '100%', height: '100%'}}>
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
                  <TripCard 
                    tripId={null}
                    headerText={"Option " + (index+1)}
                    disabled={false} 
                    onReplace={onReplace} 
                    canEdit={true} 
                    key={index} 
                    canRate={false}
                    ratingCompleted={null}
                    tripNum={index} 
                    onSelectTrip={onSelectTrip} 
                    tripInfo={trip} 
                    selected={selectedTrip == index}/>
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