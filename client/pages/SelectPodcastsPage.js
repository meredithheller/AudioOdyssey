import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import TripCard from '../components/tripCard'
import { REACT_APP_PORT_NUM } from '@env'

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
    setTripPossibilities(route.params.trips)
    setLoading(false)
  }, [])

  useEffect(() => {
    setLoading(false)
    if(tripPossibilities){
      console.log("zuchinni")
      console.log(tripPossibilities)
      setLoading(false)
    }
  }, [tripPossibilities])


  const onSelectTrip = (id) => {
    setSelectedTrip(id)
  }


  const handleSaveTrip = async () => {
    if(selectedTrip == null){
      alert('Please select a trip option to proceed.')
    }else{
      // TODO: THIS IS WHERE WE NEED TO MAKE POST REQUEST TO SAVE THE TRIP
      // WHAT NEEDS TO HAPPEN ON SAVE TRIP? 
        // generate a trip id, save trip id, username, trip, start and stop location, and date created to trip_info
        // 
        const res = fetch(`http://db8.cse.nd.edu:5009/saveTrip`, {
          method: 'POST',
          body: JSON.stringify({
            username: global.user.username,
            start_loc: route.params.startLocation,
            destination: route.params.endLocation,
            tripInfo: tripPossibilities[selectedTrip],
            categories: route.params.categories
          }),
          headers: {
              'Content-type': 'application/json; charset=UTF-8',
          }
        }).then((response) => {
          return response.json()
        })
        .then((data) => {
          alert("Successfully saved your trip. View it in the current trip page of your profile.")
          navigation.navigate('Plan Trip')
        }).catch(function(error) {
          alert('An error occurred. Please try again.')
        })
    }
  }

  const onReplace = (podcastIndex, tripIndex) => {
    setLoading(true)
    let replaceURL = `http://db8.cse.nd.edu:5009/replacePlanningPodcast?`
    const res = fetch(replaceURL + new URLSearchParams({
      username: global.user.username,
      duration: tripPossibilities[tripIndex][podcastIndex].duration,
      categories: route.params.categories
    })).then((response) => {
      return response.json()
      // TODO: figure out how to handle no podcast replacement available
    })
    .then((data) => {
      let newTripPossibilities = tripPossibilities
      newTripPossibilities[tripIndex][podcastIndex] = data
      setTripPossibilities(newTripPossibilities)
    }).catch(function(error) {
      setLoading(false)
      alert('An error occurred. Please try again.')
    }).finally(() => {
      setLoading(false)
    })
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
                    selected={selectedTrip == index}
                    updateRatings={null}/>
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