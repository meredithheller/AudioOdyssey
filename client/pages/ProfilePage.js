import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfilePage({ navigation }) {

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
    }
  });

  return (
    <View>
      <View style={styles.profileContainer}>
        <Ionicons name='ios-person' size={100} color={'#003f5c'}></Ionicons>
        <View>
          <Text style={styles.info}>John Smith</Text>
          <Text>jsmith123</Text>
          <Text>123-456-7890</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={() => {navigation.navigate("Account Settings")}}>
          <View style={styles.linkContainer}>
            <Text style={styles.link}>Account Settings</Text>
            <Ionicons name="ios-play" size={25} color={'#003f5c'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate("Upcoming Trips")}}>
          <View style={styles.linkContainer}>
            <Text style={styles.link}>Upcoming Trips</Text>
            <Ionicons name="ios-play" size={25} color={'#003f5c'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate("Past Trips")}}>  
          <View style={styles.linkContainer}>    
            <Text style={styles.link}>Past Trips</Text>
            <Ionicons name="ios-play" size={25} color={'#003f5c'} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}