import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import TripCard from '../components/tripCard'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PastTripsPage({ navigation, route }) {

  const [ loading, setLoading ] = useState(true)
  const [ page, setPage ] = useState(0)
  const [ tripHistory, setTripHistory ] = useState()
  const [ canGoForward, setCanGoForward ] = useState(true)
  const [ canGoBackward, setCanGoBackward ] = useState(false)
  const [ noMoreHistory, setNoMoreHistory ] = useState(false)

  useEffect(() => {
    getTripHist()
  }, [])

  useEffect(() => {
    if(tripHistory){
      setLoading(false)
    }
  }, [tripHistory])

  useEffect(() => {
    if(page >= 0){
      setLoading(true)
      getTripHist()
    }
  }, [page])

  const getTripHist = () => {
    setLoading(true)
    const res = fetch(`http://db8.cse.nd.edu:5009/get_user_history?` + new URLSearchParams({
      username: global.user.username,
      page: page
    })).then((response) => {
      if(!response.ok){
        // need to determine how to handle the errors
        alert('No more trips in your history')
        setLoading(false)
        return
      }
      return response.json()
    })
    .then((data) => {
      // handle if no more previous trips
      if(data.length == 0){
        setNoMoreHistory(true)
      }else{
        setNoMoreHistory(false)
      }
      setTripHistory(data)
    }).catch(function(error) {
      alert('An error occurred. Please try again.')
      navigation.navigate('Profile Home')
    })
  }

  const updateRating = (tripIndex) => {
    let podRatings = [] 
    for(let pod in tripHistory[tripIndex].podcasts){
      podRatings.push({"uri": tripHistory[tripIndex].podcasts[pod].uri, "rating": tripHistory[tripIndex].podcasts[pod].rating} )
    }
    console.log("ratings: ")
    console.log(podRatings)
    const res = fetch(`http://db8.cse.nd.edu:5009/saveRating`,  {
      method: 'POST',
      body: JSON.stringify({
        trip_id: tripHistory[tripIndex],
        username: global.user.username,
        podcastRatings: podRatings
      }),
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
      }
    }).then((response) => {
        return response.json()
    }).then((data) => {
      alert('Successfully updated podcast ratings.')
    }).catch(function(error) {
      alert('There was an error updating podcast ratings.')
    })
  }

  const ratingCompleted = (rating, podIndex, tripIndex) => {
    // update local version of the trip
    tripHistory[tripIndex].podcasts[podIndex].rating = rating
    setTripHistory(tripHistory)
  }

  return (
    loading || !tripHistory ? <SafeAreaView style={{backgroundColor: 'lightblue', width: '100%', height: '100%'}}>
      <ActivityIndicator size="large" style={styles.loading}/> 
      </SafeAreaView>: 
    <View style={{backgroundColor: 'lightblue', width: '100%', height: '100%'}}>
    <SafeAreaView>
      <View style={styles.lockedHeader}>
        { page > 0 && <TouchableOpacity  
          onPress={() => {
            if(page > 0){
              setPage(page - 1)
            }
        }}>
          <Ionicons style={styles.backButton} name={'arrow-back-circle'} size={25} color={'black'} />
        </TouchableOpacity>}
        <Text style={styles.header}>Past Trips</Text>
        { canGoForward && !noMoreHistory && <TouchableOpacity 
          onPress={() => {
            setPage(page + 1)
        }}>
          <Ionicons style={styles.nextButton} name={'arrow-forward-circle'} size={25} color={'black'} />
        </TouchableOpacity> }
      </View>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: 'center'}}
        showsVerticalScrollIndicator={true} 
        persistentScrollbar={true}>
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
      { noMoreHistory && <Text style={{alignSelf: 'center', justifySelf: 'center', paddingBottom: 30}}>No further trip history.</Text>}
      </ScrollView>
    </SafeAreaView>
    </View>
  )
}





const styles = StyleSheet.create({
    loading : {
      alignSelf: 'center',
    },
    lockedHeader: {
      flexDirection: 'row',
      width: "100%",
      alignItems: 'center',
      justifyContent: 'center',
      height: 50
    },
    backButton: {
      justifySelf: 'flex-start'
    },
    nextButton: {
      justifySelf: 'flex-end'
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
        alignSelf: 'center',
        paddingHorizontal: 70
      },
      container: {
        height: '100%'
      }

})