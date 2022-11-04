// import React from 'react';
// import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import React, {Component, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView
} from 'react-native';
import axios from 'axios';
import categs from '../constants/categories'

// insert api key here
const GOOGLE_PLACES_API_KEY = '';

export default function PlanTripPage({ navigation, route }) {
  const [searchStartKeyword, setSearchStartKeyword] = useState('')
  const [startSearchResults, setStartSearchResults] = useState([])
  const [isShowingStartResults, setIsShowingStartResults] = useState(false)
  const [ startLocation, setStartLocation ] = useState(null)
  const [searchEndKeyword, setSearchEndKeyword] = useState('')
  const [endSearchResults, setEndSearchResults] = useState([])
  const [isShowingEndResults, setIsShowingEndResults] = useState(false)
  const [ endLocation, setEndLocation ] = useState(null)
  const [ categories, setCategories ] = useState(new Set())
  const [duration, setDuration ] = useState()
  const [ podcasts, setPodcasts ] = useState()
  const [ tripID, setTripID ] = useState(null)

  let searchLocation = async (text, destination) => {
    let keyword = ''
    if(destination){
      setSearchEndKeyword(text)
      keyword = text
    }else{
      setSearchStartKeyword(text)
      keyword = text
    }
    
    axios
      .request({
        method: 'post',
        url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_PLACES_API_KEY}&input=${keyword}`,
      })
      .then((response) => {
        console.log(response.data);
        if(destination){
          setEndSearchResults(response.data.predictions);
          setIsShowingEndResults(true)
        }else{
          setStartSearchResults(response.data.predictions);
          setIsShowingStartResults(true);
        }
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  let getRoute = async () => {
    axios
      .request({
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=${GOOGLE_PLACES_API_KEY}`,
        headers: {}
      })
      .then((response) => {
        // TODO: we need to convert the duration of trip to minutes for the database AND CHANGE THIS
        setDuration(45)
      })
      .catch((e) => {
        console.log(e.response);
      });
  }

  const getTripPodcastInfo = async () => {
    catList = []
    iter = categories.values()
    i = 0
    for(const entry of iter) {
        catList[i] = entry
        i++
    }
    const res = fetch('http://127.0.0.1:5004/tripPodcasts', {
      method: 'POST',
      headers: {
        // also need to send the categories. right now it is a set (categories variable at the top) so we may have to convert this to a list or something
        // also need to send the trip duration which I have hardcoded in minutes (duration variable at the top)
        'Content-Type': 'application/json'
      },
      body:  JSON.stringify({
        categories: catList,
        duration: duration
      })   
    }).then(async (response) => response.json())
    .then((data) => {
      setPodcasts(data)
      console.log(data)
      navigation.navigate("Select Podcasts", { })
    }).catch(function(error) {
      alert('An error occurred. Please try again.')
      console.log(catList);
    })
  }


  // const getTripPodcastInfo = async () => {
  //   axios
  //     .request({
  //       method: 'get',
  //       url: `http://127.0.0.1:5001/podcasts`,
  //       headers: {}
  //     })
  //     .then((response) => {
  //       // console.log(JSON.parse(JSON.stringify(response.data)))
  //       // console.log(typeof(response.data))
  //       // TODO: we need to convert the duration of trip to minutes for the database AND CHANGE THIS
  //       setPodcasts([1, 3, 5])
  //     })
  //     .catch((e) => {
  //       console.log(e.response);
  //     });
  //   };

  // this function calls our python server to retrieve a new trip id and list of potential podcast ids
  // we need to create this endpoint (tripPodcasts) in our backend server to query sql database for potential podcasts and trip id
  // needs to setTripID and setPodcasts from server response
  // const getTripPodcastInfo = async () => {
  //   setPodcasts([1, 2, 5])
  //   // const res = fetch('http://127.0.0.1:5010/tripPodcasts', {
  //   //   method: 'GET',
  //   //   headers: {
  //   //     // also need to send the categories. right now it is a set (categories variable at the top) so we may have to convert this to a list or something
  //   //     // also need to send the trip duration which I have hardcoded in minutes (duration variable at the top)
  //   //     'Content-Type': 'application/json'
  //   //   } 
  //   // }).then(async (response) => {
  //   //   // setPodcasts(response.data.podcasts)
  //   //   // navigation.navigate("Select Podcasts", { })
  //   // }).catch(function(error) {
  //   //   alert('An error occurred. Please try again.')
  //   //   console.log(error);
  //   // })
  // }


  // this function should be triggered on the button press
  // it uses the route function then calls getTripPodcastInfo to get the trip Id and potential podcast ids
  const getTrip = async () => {
    // try {
    //   const response = await getRoute()
    //   if(duration){
    //     console.log("in duration if")
    //     console.log(duration)
    //     const pods = await getTripPodcastInfo()
    //     if(podcasts){
    //       console.log("waited? ")
    //       console.log(podcasts)
    //     }
    //     // navigation.navigate("Select Podcasts", { podcasts: podcasts, tripID: tripID, username: ''})
    //   }
    // } catch {

    // }
    // getRoute().then(async () => {
    //   if(duration){
    //     getTripPodcastInfo().then(() => {
    //       navigation.navigate("Select Podcasts", { podcasts: podcasts, tripID: tripID, username: ''})
    //     }).catch(() => {
    //       console.error("error getting trip podcast info")
    //     })
    //   }
    // }).catch(() => {

    // })
    const podcasts_response = await fetch(
      'http://db8.cse.nd.edu:5001/podcasts',
      {
        method: 'GET',
        headers: {}
      }
    );
    if(!podcasts_response.ok){
      console.error("Error getting podcasts from our server")
    }
    let podcast_data = await podcasts_response.json()
    // console.log(podcast_data)
    setPodcasts([1, 4, 5])
    const duration_response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=${GOOGLE_PLACES_API_KEY}`,
      {
        method: 'GET',
        headers: {}
      }
    );
    if(!duration_response.ok){
      console.error("duration response error")
    }
    let duration_data = await duration_response.json()
    setDuration(45)
    // console.log(podcasts)
    // console.log(duration)
    navigation.navigate("Select Podcasts", { podcasts: [1, 3, 6], tripID: 12344, username: ''})




  }

  const handleChipPress = (cat) =>{
    if(categories.has(cat)){
      let clonedSet = new Set(categories);
      clonedSet.delete(cat)
      setCategories(clonedSet)
    }else{
      let clonedSet = new Set(categories);
      clonedSet.add(cat)
      setCategories(clonedSet)
    }
  }

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Plan your trip</Text>
        <Text style={styles.labelText}>Pick a starting location: </Text>
        <View style={styles.autocompleteContainer}>
          <TextInput
            placeholder="Search for an address"
            returnKeyType="search"
            style={styles.searchBox}
            placeholderTextColor="#000"
            onChangeText={(text) => searchLocation(text, false)}
            value={searchStartKeyword}
          />
          {isShowingStartResults && (
            <FlatList
              data={startSearchResults}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() =>  {
                      setSearchStartKeyword(item.description)
                      setIsShowingStartResults(false)
                      setStartLocation(item.place_id)
                    }}>
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
              style={styles.searchResultsStartContainer}
            />
          )}
        </View>
        <Text style={styles.redirectText}>Try our destination selector</Text>
        <Text style={styles.labelText}>Pick a destination: </Text>
        <View style={styles.autocompleteContainer}>
          <TextInput
            placeholder="Search for an address"
            returnKeyType="search"
            style={styles.searchBox}
            placeholderTextColor="#000"
            onChangeText={(text) => searchLocation(text, true)}
            value={searchEndKeyword}
          />
          {isShowingEndResults && (
            <FlatList
              data={endSearchResults}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() =>  {
                      setSearchEndKeyword(item.description)
                      setIsShowingEndResults(false)
                      setEndLocation(item.place_id)
                    }}>
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
              style={styles.searchResultsEndContainer}
            />
          )}
        </View>
        <Text style={styles.labelText}>What topics are you interested in listening to?</Text>
        <ScrollView style={styles.chipContainer} contentContainerStyle={{flexDirection: "row", flexWrap: "wrap", justifyContent: "center"}}>
            { categs.map((cat) => {
                return (
                    <TouchableOpacity style={categories.has(cat) ? styles.selectedChip : styles.unselectedChip} key={cat} onPress={() => handleChipPress(cat)}>
                        <Text style={categories.has(cat) ? styles.categorySelected : styles.categoryUnselected}>{cat}</Text>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
        <Pressable style={styles.button} onPress={getTrip}>
          <Text style={styles.buttonText}>Plan my trip</Text>
        </Pressable>

      </SafeAreaView>
    )
  }

const styles = StyleSheet.create({
  autocompleteContainer: {
    zIndex: 1,
  },
  searchResultsStartContainer: {
    width: 340,
    height: 100,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50,
  },
  searchResultsEndContainer: {
    width: 340,
    height: 100,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50,
  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
  searchBox: {
    width: 340,
    height: 50,
    fontSize: 18,
    borderRadius: 8,
    borderColor: '#aaa',
    color: '#000',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    paddingLeft: 15,
  },
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
  },
  labelText: {
    padding: 5,
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#5A5A5A'
  },
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
  },
  header: {
    color: 'black',
    fontWeight: 'bold',
    letterSpacing: 0.25,
    textTransform: 'uppercase',
    fontSize: 24,
    paddingTop: 10
  }, 
  redirectText: {
    color: 'black',
    fontWeight: 'medium',
    letterSpacing: 0.25,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    fontSize: 12,
    paddingTop: 10,
    paddingBottom: 60
  },
  chipContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 150,
    width: 340,
    padding: 3
  },
  selectedChip: {
      backgroundColor: '#5A5A5A',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#5A5A5A',
      height: 30,
      flexDirection: 'row', 
      alignContent: 'center',
      justifyContent: 'center',
      padding: 3,
      margin: 5
  }, 
  unselectedChip: {
      borderColor: '#5A5A5A',
      borderWidth: 2,
      borderRadius: 8,
      height: 30,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      padding: 3,
      margin: 5
  },
  categorySelected: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  categoryUnselected: {
    color: '#5A5A5A',
    fontSize: 10,
    fontWeight: 'bold',
    alignSelf: 'center'
  }
});