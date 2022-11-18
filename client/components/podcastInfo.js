import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';


export default function PodcastInfo({ currentRating, tripId, ratingCompleted, onReplace, tripIndex, canRate, canReplace, podInfo, podIndex }) {
    const [ rating, setRating ] = useState(0)

    useEffect(() => {
    })

    let image_url = "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded/2493250/2493250-1571260851467-0eaf5106f2d8a.jpg"
    let show_name = "How I Built This"
    let episode_name = "Happy Family Organics"
    let episode_desc = "This episode gets very emotional very quickly, so don't be surprised if we suddenly burst out in tears. We talk about not feeling good enough, insecurities, and confrontation. It's an emotional rollercoaster.  ---   Support this podcast: https://anchor.fm/teenagertherapy/support"

    return (
        podInfo &&
        <View style={styles.podcastContainer}>
            <View style={styles.podcastInfo}>
                <View style={styles.leftSide}>
                    <Image style={styles.podImage}
                            source={{
                                uri: podInfo.image_url
                            }}
                            resizeMode={'contain'}/>
                    { canReplace && <Pressable 
                        style={styles.replaceButton} 
                        onPress={()=> onReplace(podIndex, tripIndex)}>
                        <Text style={{color: '#fff'}}>Replace</Text>
                    </Pressable>}
                </View>
                <View style={styles.rightSide}>
                    <Text style={styles.episodeTitle}>{podInfo.episode_name}</Text>
                    <Text style={styles.showTitle}>{podInfo.show_name}</Text>
                    <Text style={styles.episodeDescription}>{podInfo.description}</Text>
                </View>
            </View>
            { canRate && <Rating
                startingValue={currentRating}
                onFinishRating={(rating) => ratingCompleted(rating, podIndex)}
                style={{ paddingVertical: 10}}
            /> }
        </View>

    )
}

const styles = StyleSheet.create({
    podcastContainer: {
        flexDirection: 'column',
        borderColor: 'grey',
        width: '100%',
        borderWidth: 1,
        margin: 3, 
        borderRadius: 10,
        bottomPadding: 5,
        backgroundColor: 'white'
    },
    podcastInfo : {
        flexDirection: 'row',
        width: '100%'
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