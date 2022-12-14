// import React from 'react';
// import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import categs from '../constants/categories';
import { REACT_APP_GOOGLE_PLACES_API_KEY } from '@env';

const tripOptionsURL = `http://db8.cse.nd.edu:5009/tripOptions?`

export default function PlanTripPage({ navigation, route }) {
  const [searchStartKeyword, setSearchStartKeyword] = useState('')
  const [startSearchResults, setStartSearchResults] = useState([])
  const [isShowingStartResults, setIsShowingStartResults] = useState(false)
  const [ startLocation, setStartLocation ] = useState()
  const [searchEndKeyword, setSearchEndKeyword] = useState('')
  const [endSearchResults, setEndSearchResults] = useState([])
  const [isShowingEndResults, setIsShowingEndResults] = useState(false)
  const [ endLocation, setEndLocation ] = useState()
  const [ categories, setCategories ] = useState(new Set())
  const [duration, setDuration ] = useState()
  const [ podcasts, setPodcasts ] = useState()
  const [ tripID, setTripID ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const [ trips, setTrips ] = useState(null)

  useEffect(() => {
    if(trips && trips.length == 0){
      alert('No possibilities. Try selecting more categories.')
    }else if(trips){
      navigation.navigate("Select Podcasts", { trips: trips, startLocation: searchStartKeyword, endLocation: searchEndKeyword, categories: [...categories]})
    }
  }, [trips]);

  useEffect(() => {
    if (endLocation && startLocation) {
      getRoute();
    }
  }, [endLocation, startLocation]);

  let searchLocation = async (text, destination) => {
    let keyword = '';
    if (destination) {
      setSearchEndKeyword(text);
      keyword = text;
    } else {
      setSearchStartKeyword(text);
      keyword = text;
    }
    
    axios
      .request({
        method: 'post',
        url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${REACT_APP_GOOGLE_PLACES_API_KEY}&input=${keyword}`
      })
      .then((response) => {
        if (destination) {
          setEndSearchResults(response.data.predictions);
          setIsShowingEndResults(true)
        } else {
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
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${startLocation}&destination=place_id:${endLocation}&key=${REACT_APP_GOOGLE_PLACES_API_KEY}`,
        headers: {}
      })
      .then((response) => {
        setDuration(response.data.routes[0].legs[0].duration.value);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getTripPodcastInfo = async () => {

    if(!endLocation || !startLocation || !duration){
      alert('Please enter valid starting and destination locations')
      return
    }
    if(duration > 108000){
      alert('Trip is too long. Please choose a shorter travel distance.')
      return
    }
    setLoading(true)
    // TODO: make sure a destination has been sent and duration is a valid number
    let catList = [...categories];
    let formattedCategoryParam = 'none';
    if (categories.size > 0) {
      formattedCategoryParam = [...categories].join(',').replace(/\s/g, '_');
    }
    // TODO: This should be a GET request
    const res = fetch(`http://db8.cse.nd.edu:${global.port}/tripOptions?` + new URLSearchParams({
        duration: duration,
        categories: formattedCategoryParam
      }))
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if(JSON.stringify(data) === '{}'){
          setLoading(false)
          alert('Can\'t plan a trip with these intputs.')
        }else{
          setTrips(data);
          setLoading(false);
        }
      })
      .catch(function(error) {
        setLoading(false);
        alert('An error occurred. Please try again.');
      });
  };

  const handleChipPress = (cat) =>{
    if(categories.has(cat)) {
      let clonedSet = new Set(categories);
      clonedSet.delete(cat);
      setCategories(clonedSet);
    } else {
      let clonedSet = new Set(categories);
      clonedSet.add(cat);
      setCategories(clonedSet);
    }
  }

    return (
       loading ? <SafeAreaView style={styles.container}>
        <Text style={styles.labelText}>Loading Trip Options</Text>
      <ActivityIndicator size="large"/> 
      </SafeAreaView> 
      : <SafeAreaView style={styles.container}>
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
            onBlur={() => setIsShowingStartResults(false)}
          />
          {isShowingStartResults && (
            <FlatList
              data={startSearchResults}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() =>  {
                      setSearchStartKeyword(item.description);
                      setIsShowingStartResults(false);
                      setStartLocation(item.place_id);
                    }}>
                    <Text key={item}>{item.description}</Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => {
                return item.place_id;
              }}
              style={styles.searchResultsStartContainer}
            />
          )}
        </View>
        <Image style={styles.roadImg} resizeMode="contain" source={require('../assets/road.png')}/>
        <Text style={styles.labelText}>Pick a destination: </Text>
        <View style={styles.autocompleteContainer}>
          <TextInput
            placeholder="Search for an address"
            returnKeyType="search"
            style={styles.searchBox}
            placeholderTextColor="#000"
            onChangeText={(text) => searchLocation(text, true)}
            value={searchEndKeyword}
            onBlur={() => setIsShowingStartResults(false)}
          />
          {isShowingEndResults && (
            <FlatList
              data={endSearchResults}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() =>  {
                      setSearchEndKeyword(item.description);
                      setIsShowingEndResults(false);
                      setEndLocation(item.place_id);
                    }}>
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => {
                return item.place_id;
              }}
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
        <Pressable style={styles.button} onPress={getTripPodcastInfo}>
          <Text style={styles.buttonText}>Plan my trip</Text>
        </Pressable>
      </SafeAreaView>
      )
  }

const styles = StyleSheet.create({
  autocompleteContainer: {
    zIndex: 1
  },
  searchResultsStartContainer: {
    width: 340,
    height: 100,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50
  },
  searchResultsEndContainer: {
    width: 340,
    height: 100,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50
  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15
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
    paddingLeft: 15
  },
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center'
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
  roadImg: {
    height: 80
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