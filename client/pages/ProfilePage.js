import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfilePage({ navigation }) {

  const logout = () => {
    global.user = {};
    global.loggedIn = false;
    navigation.navigate("Landing");
  }

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
    },
    logoutBtn: {
      width:"80%",
      borderRadius: 10,
      alignItems:"center",
      justifyContent:"center",
      backgroundColor:"#003f5c",
      margin: 16,
      width: 100
    },
    logoutText: {
      color: "white",
      padding: 10,
      fontSize: 15,
    }
});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons name='ios-person' size={100} color={'#003f5c'}></Ionicons>
        <View>
          <Text style={styles.info}>{global.user.firstname} {global.user.lastname}</Text>
          <Text>{global.user.username}</Text>
          <Text>({global.user.phonenumber.slice(0,3)}) {global.user.phonenumber.slice(3,6)}-{global.user.phonenumber.slice(6,11)}</Text>
        </View>
      </View>
      <View>
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
        <TouchableOpacity onPress={() => {navigation.navigate("AudioOdyssey Wrapped")}}>  
          <View style={styles.linkContainer}>    
            <Text style={styles.link}>My AudioOdyssey Wrapped</Text>
            <Ionicons name="ios-play" size={25} color={'#003f5c'} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}> 
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}