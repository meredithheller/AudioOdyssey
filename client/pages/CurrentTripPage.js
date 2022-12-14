import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import TripCard from '../components/tripCard';
import openMap from 'react-native-open-maps';

export default function CurrentTrip({ navigation }) {

  const [ loading, setLoading ] = useState(true)
  const [ tripId, setTripId ] = useState()
  const [ podcasts, setPodcasts ] = useState()
  const [ startingLocation, setStartingLocation] = useState('')
  const [ destination, setDestination ] = useState('')


  useEffect(() => {
    // TODO: on mount, call api to get the most recent trip
      // be sure to handle the fact that there is not a current trip
    setLoading(true)
    getCurrentTrip()
  }, [])

  useEffect(() => {
    if(tripId && podcasts){
      setLoading(false)
    }
  }, [tripId, podcasts])


  const getCurrentTrip = async () => {
    // TODO: This should be a GET request
    const res = fetch(`http://db8.cse.nd.edu:${global.port}/getCurrTrip?` + new URLSearchParams({
      username: global.user.username
    })).then((response) => {
      return response.json()
    })
    .then((data) => {
      if(JSON.stringify(data) === '{}'){
        alert('No trips planned.')
        navigation.navigate('Profile Home') 
      }else{
        setStartingLocation(data.start_loc);
        setDestination(data.destination);
        setPodcasts(data.podcasts);
        setTripId(data.trip_id);
      }
    }).catch(function(error) {
      alert('An error occurred. Please try again.');
      navigation.navigate('Profile Home');
    })
  }

  const onReplace = async (podIndex) => {
    // TODO: CALL THE REPLACE ENDPOINT
    // POST REQUEST
    // THIS IS NOT DONE
    const res = fetch(`http://db8.cse.nd.edu:${global.port}/updateHistSavedTrip`, {
      method: 'POST',
      body: JSON.stringify({
        tripId: tripId,
        podcastId: podcasts[podIndex],
        username: global.user.username
      }),
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
      }
    }).then((response) => {
        return response.json()
        // TODO: need to handle if there wasn't a podcast that it could be replaced with
        // alert('No possible podcast substitutions.')
    }).then((data) => {
      setLoading(true)
      getCurrentTrip()
    }).catch(function(error) {
      alert('An error occurred. Please try again.')
      navigation.navigate('Profile Home')
    })
  }

  const handleSaveRating = () => {
    // TODO: create backend endpoint to rate a podcast
        // SEND IT username, podcast_id, tripId (prop), and rating
        let podRatings = [] 
        for (let pod in podcasts) {
          podRatings.push({"uri": podcasts[pod].uri, "rating": podcasts[pod].rating});
        }
        const res = fetch(`http://db8.cse.nd.edu:${global.port}/saveRating`,  {
          method: 'POST',
          body: JSON.stringify({
            trip_id: tripId,
            username: global.user.username,
            podcastRatings: podRatings
          }),
          headers: {
              'Content-type': 'application/json; charset=UTF-8',
          }
        }).then((response) => {
            return response.json()
        }).then((data) => {
          // handle response
          navigation.navigate('Profile Home')
          alert('Successfully saved ratings.')
        }).catch(function(error) {
          alert('there was a problem saving podcast rating')
        })
  }

  const ratingCompleted = (rating, podcastIndex) => {
    podcasts[podcastIndex].rating = rating;
    setPodcasts(podcasts);
    // edit the current trip podcast information so that it reflects the new rating
  }

  const startTrip = () => {
    openMap({ start: startingLocation, end: destination });
  }

  return (
    loading ? 
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView> :
      <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.startBtn} onPress={() => startTrip()}>
            <Text style={styles.header}>Start Trip</Text>
          </TouchableOpacity>
          <ScrollView
            style={{height: '100%', paddingBotton: 20}}
            showsVerticalScrollIndicator={true} 
            persistentScrollbar={true}
            contentContainerStyle={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: 'center'}}
          >

          <TripCard 
            headerText={"From " + startingLocation + " to " + destination}
            disabled={true} 
            onReplace={onReplace} 
            canRate={true}
            ratingCompleted={ratingCompleted}
            canEdit={true} 
            tripNum={null} 
            onSelectTrip={null} 
            tripInfo={podcasts} 
            selected={false}
            updateRatings={null}/>
      </ScrollView>
      <Pressable 
              style={styles.button} 
              onPress={() => {
              handleSaveRating()
            }}>
              <Text style={styles.buttonText} onPress={() => handleSaveRating()}>Save Podcast Ratings</Text>
      </Pressable>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    width: '100%', 
    height: '100%'
  },
  header: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 0.25,
    fontSize: 24,
    padding: 10
  },
  labelText: {
    padding: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#5A5A5A',
    alignSelf: 'flex-start'
  },
  button: {
    position: 'absolute',
    bottom: 5,
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
  startBtn: {
    width:"80%",
    borderRadius: 10,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#003f5c",
    margin: 16,
    width: 200,
    alignSelf: 'center'
  }
});