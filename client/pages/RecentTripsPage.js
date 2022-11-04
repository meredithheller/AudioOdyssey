import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';

export default function RecentTripsPage({ navigation }) {

  const [ recentTrips, setRecentTrips ] = useState([])
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    getRecentTrips()
  })

  useEffect

  const getRecentTrips = () => {
    // make api call to get the 5 most recent trips and their ratings
    // convert to array of arrays where [trip_id, rating]
    // then set recent trips to that array
  }

  const updateRating = () => {
    // make api call to update that trips rating
  }


  return (
    <View>
      {
        loading ? <ActivityIndicator/> :
        <ScrollView>
          
        </ScrollView>
      }
      
    </View>
  );
}