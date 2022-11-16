import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import PodcastInfo from './podcastInfo';

export default function TripCard({ onReplace, isSavedTrip, canEdit, tripNum, tripInfo, onSelectTrip, selected }) {
    useEffect(() => {
    })

    return (
        <TouchableOpacity style={selected ? styles.selectedTripContainer : styles.unselectedTripContainer} onPress={() => onSelectTrip(tripNum)}>
            <Text style={styles.tripText}>Trip Option {tripNum}</Text>
            { tripInfo.map((podcast, index) => { 
                return (
                <PodcastInfo tripIndex={tripNum} onReplace={onReplace} key={index} canEdit={true} canRate={true} podIndex={index} podInfo={podcast}/>
            )})}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    selectedTripContainer : {
        backgroundColor: '#f0eee9',
        padding: 15,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        margin: 20,
        borderRadius: 10,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    unselectedTripContainer : {
        backgroundColor: '#f0eee9',
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
        margin: 3, 
        borderRadius: 10,
        bottomPadding: 5,
        backgroundColor: 'white'
    },
    podcastImg : {
        width: 30
    },
    tripText : {
        fontSize: 20,
        fontWeight: 'bold',
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        paddingBottom: 5
    },
    episodeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    showTitle : {
        fontSize: 14,
    },
    episodeDescription: {
        fontSize: 11
    },
    leftSide: {
        flexDirection: 'column',
        padding: 7,
        justifyContent: 'flex-start',
        gap: 5
    },
    rightSide: {
        flexDirection: 'column',
        padding: 5,
        justifyContent: 'flex-start',
        gap: 5,
        width: '70%'
    },
    podImage: {
        width: 80,
        height: 80,
        borderRadius: 3,
        alignSelf: 'center'
    },
    replaceButton: {
        backgroundColor: 'gray',
        borderRadius: 3,
        marginTop: 5,
        alignItems: 'center',
        padding: 5
    }
})