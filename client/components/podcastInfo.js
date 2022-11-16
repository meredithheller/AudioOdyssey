import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, ScrollView } from 'react-native';
// import StarRating from 'react-native-star-rating';

export default function PodcastInfo({ canRate, canEdit, podInfo }) {
    const [ rating, setRating ] = useState(0)

    let image_url = "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded/2493250/2493250-1571260851467-0eaf5106f2d8a.jpg"
    let show_name = "How I Built This"
    let episode_name = "Happy Family Organics"
    let episode_desc = "This episode gets very emotional very quickly, so don't be surprised if we suddenly burst out in tears. We talk about not feeling good enough, insecurities, and confrontation. It's an emotional rollercoaster.  ---   Support this podcast: https://anchor.fm/teenagertherapy/support"

    const onStarRatingPress = (rating) => {
        // edit the podcast/trip object
        setRating(rating)
    }

    useEffect(() => {
        console.log("hello")
    })

    return (
        <View style={styles.podcastContainer}>
            {console.log("here")}
            <View style={styles.leftSide}>
                <Image style={styles.podImage}
                        source={{
                            uri: "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded/2493250/2493250-1571260851467-0eaf5106f2d8a.jpg"
                        }}
                        resizeMode={'contain'}/>
                { canEdit && <Pressable style={styles.replaceButton}>
                    <Text style={{color: '#fff'}}>Replace</Text>
                </Pressable>}
            </View>
            <View style={styles.rightSide}>
                <Text style={styles.episodeTitle}>{episode_name}</Text>
                <Text style={styles.showTitle}>{show_name}</Text>
                <Text style={styles.episodeDescription}>{episode_desc}</Text>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
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