import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import TripCard from '../components/tripCard';

let pastTrips = [{ "trip_id": 439841,
"starting_loc": "Boston, MA",
"destination": "South Bend, IN",
"podcasts": 
[{
  "description": "blah blah blah blah",
  "duration": 21.460466666666665,
  "episode_name": "S1 Ep4: Life Upon the Wicked Stage",
  "image_url": "https://megaphone.imgix.net/podcasts/6343dace-1ae0-11ea-8c84-afebdfb406dd/image/Gimlet_TwoPrincesS1_ShowArt_3000x3000.jpg?ixlib=rails-2.1.2&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
  "show_name": "Taylor Swift",
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
  "rating": 5
}]}, { "trip_id": 4313254,
"starting_loc": "Bloomington, IL",
"destination": "Bloomington, IN",
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
}, { "description": "THis is a really aweesome podcast",
"duration": 9.523666666666667,
"episode_name": "How to start a business",
"image_url": "https://www.omnycontent.com/d/clips/f908bc33-68fa-4916-a2c1-af18015ff9f6/9df731a0-f896-428e-839d-af180160de06/718bfbb1-767d-4747-90e3-af18017a4c8e/image.jpg?t=1663887445&size=Large",
"show_name": "Business Pod",
"uri": "spotify:episode:0AYRBGOGItwTrWpKBQAyvm",
"rating": 3
}]}, { "trip_id": 4313254,
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
},{ "description": "this is a good podcast by awesome hosts",
  "duration": 140,
  "episode_name": "The Great Adventure",
  "image_url": "https://www.omnycontent.com/d/clips/f908bc33-68fa-4916-a2c1-af18015ff9f6/9df731a0-f896-428e-839d-af180160de06/718bfbb1-767d-4747-90e3-af18017a4c8e/image.jpg?t=1663887445&size=Large",
  "show_name": "Freakonomics",
  "uri": "spotify:episode:0AYRBGOGItwTrWpKBQAyvm",
  "rating": 1
}]}]

export default function PastTripsPage({ navigation, route }) {

  const [ loading, setLoading ] = useState(true)
  const [ tripHistory, setTripHistory ] = useState()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setTripHistory(pastTrips)
    }, 1000);
  }, [])

  useEffect(() => {
    if(tripHistory){
      setLoading(false)
    }
  }, [tripHistory])

  const updateRating = (tripIndex) => {
    let podRatings = [] 
    for(let pod in tripHistory[tripIndex]){
      podRatings.push((podcasts[pod].uri, podcasts[pod].rating))
    }
    const res = fetch(`http://db8.cse.nd.edu:${global.port}/saveRating`,  {
      method: 'POST',
      body: JSON.stringify({
        trip_id: tripHistory[tripId],
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
    }).catch(function(error) {

    })

    // TODO: call endpoint to update the rating of this podcast in the backend
    // reload trips but just try to reload the single trip
  }

  const ratingCompleted = (rating, podIndex, tripIndex) => {
    // update local version of the trip
    tripHistory[tripIndex].podcasts[podIndex].rating = rating
  }

  return (
    loading && !tripHistory ? <SafeAreaView style={{backgroundColor: 'lightblue', width: '100%', height: '100%'}}>
      <ActivityIndicator size="large" style={styles.loading}/> 
      </SafeAreaView>: 
    <View style={{backgroundColor: 'lightblue', width: '100%', height: '100%'}}>
    <SafeAreaView>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: 'center'}}
        showsVerticalScrollIndicator={true} 
        persistentScrollbar={true}>
        <Text style={styles.header}>Past Trips</Text>
        { tripHistory.map((trip, index) => {
                return (
                  <TripCard 
                    tripId={trip.trip_id}
                    headerText={"From " + trip.starting_loc + " to " + trip.destination}
                    disabled={true} 
                    onReplace={null} 
                    canEdit={false} 
                    key={index} 
                    canRate={true}
                    ratingCompleted={ratingCompleted}
                    tripNum={index} 
                    onSelectTrip={null} 
                    tripInfo={trip.podcasts} 
                    selected={false}
                    updateRatings={updateRating}
                  />
                )
            })}
      </ScrollView>
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