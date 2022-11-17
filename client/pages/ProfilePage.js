import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfilePage({ navigation, route }) {

  const styles = StyleSheet.create({
    profileContainer: {
      display:'flex', 
      flexDirection:'row',
      justifyContent: 'left',
      alignItems: 'center',
      margin: 25
    },
    link: {
      fontSize: 25,
      color: '#003f5c',
      margin: 5
    },
    linkContainer: {
      display:'flex', 
      flexDirection:'row',
      alignItems:'center',
      margin: 10
    },
    info: {
      fontSize: 25
    },
    container: {
      backgroundColor: 'lightblue',
      height: '100%'
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons name='ios-person' size={100} color={'#003f5c'}></Ionicons>
        <View>
          <Text style={styles.info}>{route.params.firstname} {route.params.lastname}</Text>
          <Text>{route.params.username}</Text>
          <Text>{route.params.phonenumber.slice(0,3)}-{route.params.phonenumber.slice(3,6)}-{route.params.phonenumber.slice(6,11)}</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={() => {navigation.navigate("Account Settings")}}>
          <View style={styles.linkContainer}>
            <Text style={styles.link}>Account Settings</Text>
            <Ionicons name="ios-play" size={25} color={'#003f5c'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate("Current Trip")}}>
          <View style={styles.linkContainer}>
            <Text style={styles.link}>Current Trip</Text>
            <Ionicons name="ios-play" size={25} color={'#003f5c'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate("Past Trips")}}>  
          <View style={styles.linkContainer}>    
            <Text style={styles.link}>Past Trips</Text>
            <Ionicons name="ios-play" size={25} color={'#003f5c'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate("Past Trips")}}>  
          <View style={styles.linkContainer}>    
            <Text style={styles.link}>My AudioOdyssey Wrapped</Text>
            <Ionicons name="ios-play" size={25} color={'#003f5c'} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}