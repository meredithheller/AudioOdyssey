import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Button, ScrollView } from 'react-native';

export default function TripCard({ canEdit, tripNum, tripInfo, onSelectTrip, selected }) {

    let image_url = "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded/2493250/2493250-1571260851467-0eaf5106f2d8a.jpg"
    let show_name = "How I Built This"
    let episode_name = "Happy Family Organics"
    let episode_desc = "This episode gets very emotional very quickly, so don't be surprised if we suddenly burst out in tears. We talk about not feeling good enough, insecurities, and confrontation. It's an emotional rollercoaster.  ---   Support this podcast: https://anchor.fm/teenagertherapy/support"

    return (
        <TouchableOpacity style={selected ? styles.selectedTripContainer : styles.unselectedTripContainer} onPress={() => {onSelectTrip(tripNum)}}>
            <Text styles={styles.tripText}>Trip {tripNum}</Text>
            { tripInfo.map((podcast, index) => {
                return (
                  <View style={styles.podcastContainer}>
                    <View>
                        <Image style={styles.podcastImg}
                                source={{
                                    uri: "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded/2493250/2493250-1571260851467-0eaf5106f2d8a.jpg"
                                }}
                                resizeMode={'contain'}/>
                        { canEdit && <Button title="Replace"/>}
                    </View>
                    <View style={{width: 230}}>
                        <Text styles={styles.episodeName}>{episode_name}</Text>
                        <Text>{show_name}</Text>
                        <Text>{episode_desc}</Text>
                    </View>

                  </View>
                )
            })}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    selectedTripContainer : {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 2,
        margin: 20,
        borderRadius: 10,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    unselectedTripContainer : {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 2,
        borderColor: 'black',
        margin: 20,
        borderRadius: 10,
    },
    podcastContainer : {
        flexDirection: 'row',
        borderColor: 'grey',
        width: '100%',
        borderWidth: 1,
        margin: 2, 
        borderRadius: 10
    },
    podcastImg : {
        width: 30
    },
    tripText : {
        fontSize: 18,
        fontStyle: 'bold'
    },
    episodeName : {
        fontSize: 14,
        fontStyle: 'bold'
    }
})