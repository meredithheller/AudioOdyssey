import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

export default function PodcastChoice({ id }) {
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
        console.log("running this")
        // here make request to python server for the podcast's info from podcasts table given the podcast id
        // set episodeName, showName, and rssLink
        // then set loading to false
        // if error, alert and leave loading true
        const podcasts_response = await fetch(
            'http://db8.cse.nd.edu:5001/podcasts',
            //'http://127.0.0.1:5001/podcastInfo',
            {
              method: 'GET',
              headers: {}
            }
          );
          if(!podcasts_response.ok){
            console.error("Error getting podcast info from our server")
          }else{
            const data = await podcasts_response.json()
            // setEpisodeName(data.episodeName)
            // setShowName(data.showName)
            // setRss(data.rss)
            setEpisodeName('A Podcast Episode')
            setShowName('A Show')
            setRss('A link')
          }
    }

    return (
        <TouchableOpacity style={styles.podcastContainer}>
            <Text style={styles.tripText}>{`Podcast ID: ${id}`}</Text>
            { loading ? <ActivityIndicator/> : 
            <View>
                <Text style={styles.labelText}>{`Show: ${showName}`}</Text>
                <Text style={styles.labelText}>{`Episode: ${episodeName}`}</Text>
            </View>}
        </TouchableOpacity>
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
        padding: 5,
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
        fontSize: 16
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