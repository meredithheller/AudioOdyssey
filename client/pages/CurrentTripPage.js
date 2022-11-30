import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import TripCard from '../components/tripCard'
import { REACT_APP_PORT_NUM } from '@env'

let modelTrip = { "trip_id": 4313254,
"starting_loc": "Boston, MA",
"destination": "South Bend, IN",
"podcasts": 
[{
  "description": "Rupert and Amir are a captive audience. The Two Princes was created and written by Kevin Christopher Snipes and directed by Mimi O'Donnell. Shohreh Aghdashloo- Queen Atossa, Christine Baranski- Queen Lavinia, Alfredo Narciso- Barabbas, Noah Galvin- Prince Rupert, Ari'el Stachel- Prince Amir, Richard Kind- Cedric, and Mandi Masden- Crazy Tooth. Executive producer Mimi O'Donnell, senior producer Katie Pastore, producer Annamaria Sofillas, associate producer MR Daniel. Edited and mixed by Matthew Boll, sound design by Daniel Brunelle, score by Greg Laswell and Bobby Lord. The Two Princes is a production of Gimlet Media",
  "duration": 21.460466666666665,
  "episode_name": "S1 Ep4: Life Upon the Wicked Stage",
  "image_url": "https://megaphone.imgix.net/podcasts/6343dace-1ae0-11ea-8c84-afebdfb406dd/image/Gimlet_TwoPrincesS1_ShowArt_3000x3000.jpg?ixlib=rails-2.1.2&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
  "show_name": "The Two Princes",
  "uri": "spotify:episode:01H2zsq0DPgqbLTgFmtbL4",
  "rating": 0
},
{ "description": "Recapping my life since I moved to Texas and my weekend in Waco Texas at the elite barrelnanza   ---   This episode is sponsored by  · Anchor: The easiest way to make a podcast.  https://anchor.fm/app",
  "duration": 33.62868333333333,
  "episode_name": "Introductory episode. ",
  "image_url": "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded/2330768/2330768-1573872310601-7bfb73e99f23.jpg",
  "show_name": "Betty Life: Behind the Scenes, stories and life lessons",
  "uri": "spotify:episode:09TwoMq3ZpNnigN7EP8rmn",
  "rating": 2
},{ "description": "Tree-Tree has an amazing dream that changes his life forever!  ---   Support this podcast: https://anchor.fm/kids-short-stories/support",
  "duration": 9.523666666666667,
  "episode_name": "The Small Tree With Big Dreams",
  "image_url": "https://www.omnycontent.com/d/clips/f908bc33-68fa-4916-a2c1-af18015ff9f6/9df731a0-f896-428e-839d-af180160de06/718bfbb1-767d-4747-90e3-af18017a4c8e/image.jpg?t=1663887445&size=Large",
  "show_name": "Kids Short Stories",
  "uri": "spotify:episode:0AYRBGOGItwTrWpKBQAyvm",
  "rating": 0
}]}



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
    const res = fetch(`http://db8.cse.nd.edu:${REACT_APP_PORT_NUM}/getCurrTrip?` + new URLSearchParams({
      username: global.user.username
    })).then((response) => {
      return response.json()
    })
    .then((data) => {
      setStartingLocation(data.start_loc)
      setDestination(data.destination)
      setPodcasts(data.podcasts)
      setTripId(data.trip_id)
    }).catch(function(error) {
      alert('An error occurred. Please try again.')
      navigation.navigate('Profile Home')
    })
  }

  const onReplace = async (podIndex) => {
    // TODO: CALL THE REPLACE ENDPOINT
    // POST REQUEST
    // THIS IS NOT DONE
    const res = fetch(`http://db8.cse.nd.edu:${REACT_APP_PORT_NUM}/updateHistSavedTrip`,  {
      method: 'POST',
      body: JSON.stringify({
        duration: podcasts[podIndex].duration,
        categories: (route.params.categories).join(',').replace(/\s/g, '_'),
        username: global.user.username
      }),
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
      }
    }).then((response) => {
        return response.json()
    }).then((data) => {
      // reload current trip information
      // handle how to update the trip information probably just setPodcasts and it will update?
    }).catch(function(error) {
      alert('Unable to replace this podcast.')
    })
  }

  const handleSaveRating = () => {
    // TODO: create backend endpoint to rate a podcast
        // SEND IT username, podcast_id, tripId (prop), and rating
        let podRatings = [] 
        for(let pod in podcasts){
          podRatings.push({"uri": podcasts[pod].uri, "rating": podcasts[pod].rating})
        }
        const res = fetch(`http://db8.cse.nd.edu:${REACT_APP_PORT_NUM}/saveRating`,  {
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
    console.log('here')
    podcasts[podcastIndex].rating = rating;
    setPodcasts(podcasts)
    // edit the current trip podcast information so that it reflects the new rating
  }

  return (
    loading ? <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView> :
    <SafeAreaView style={styles.container}>
          <Text style={styles.header}>Current Trip</Text>
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
    color: 'black',
    fontWeight: 'bold',
    letterSpacing: 0.25,
    textTransform: 'uppercase',
    fontSize: 24,
    paddingTop: 10,
    alignSelf: 'center'
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
});