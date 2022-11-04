import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function PodcastChoice({ id }) {
    const [ loading, setLoading ] = useState(true)
    const [ episodeName, setEpisodeName ] = useState('')
    const [ showName, setShowName ] = useState('')
    const [ rss, setRss ] = useState('')
    
    const getPodcastInfo = () => {
        // here make request to python server for the podcast's info from podcasts table given the podcast id
        // set episodeName, showName, and rssLink
        // then set loading to false
        // if error, alert and leave loading true
    }

    return (
        <View>
            <Text>{`Trip ID: ${id}`}</Text>
            { loading ? <ActivityIndicator/> : 
            <View>
                <Text>{`Show: ${showName}`}</Text>
                <Text>{`Episode: ${episodeName}`}</Text>
            </View>}
        </View>
    )
}