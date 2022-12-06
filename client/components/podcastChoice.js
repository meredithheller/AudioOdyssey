import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { REACT_APP_PORT_NUM } from '@env'

export default function PodcastChoice({ uri }) {
    const [ loading, setLoading ] = useState(true)
    const [ episodeName, setEpisodeName ] = useState('')
    const [ showName, setShowName ] = useState('')
    const [ rss, setRss ] = useState('')

    useEffect(() => {
        getPodcastInfo()
    }, [])

    useEffect(() => {
        if(episodeName && showName){
            setLoading(false)
        }
    }, [rss, showName, episodeName])


    const getPodcastInfo = async () => {
    // here make request to python server for the podcast's info from podcasts table given the podcast id
    // set episodeName, showName, and rssLink
    // then set loading to false
    // if error, alert and leave loading true
    const podcasts_response = await fetch(
      `http://db8.cse.nd.edu:5009/podcasts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        episode_uri: uri
        })
      }).then(async (response) => response.json())
      .then((data) => {
        setEpisodeName(data[0][0])
        setShowName(data[0][1])
        setRss('A link')
      }).catch(function(error) {
        // alert('An error occurred. Please try again.')
      })
    }

    return (
        <View style={styles.podcastContainer}>
            <Text style={styles.tripText}>{`Podcast ID: ${uri}`}</Text>
            { loading ? <ActivityIndicator/> : 
            <View>
                <Text style={styles.labelText}>{`Show: ${showName}`}</Text>
                <Text style={styles.labelText}>{`Episode: ${episodeName}`}</Text>
            </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        margin: 10
      },
      labelText: {
        padding: 2,
        paddingTop: 10,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#5A5A5A'
      },
      header: {
        color: 'black',
        fontWeight: 'bold',
        letterSpacing: 0.25,
        textTransform: 'uppercase',
        fontSize: 24,
        paddingTop: 10
      },
      container: {
        height: '95%'
      },
      tripText: {
        color: 'black',
        fontWeight: 'bold',
        letterSpacing: 0.25,
        textTransform: 'uppercase',
        fontSize: 14
      },
      podcastContainer: {
        height: 100,
        width: '90%',
        backgroundColor: 'white',
        margin: 5,
        padding: 5,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10
      }
})