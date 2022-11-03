import { Button, ImageBackground, StyleSheet, Text, View, Modal, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';

export default function LandingPage({ navigation }) {

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const createAccount = () => {
    return fetch('http://127.0.0.1:5001/createAccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
        phoneNumber: phoneNumber
      })   
    }).then((response) => {
      console.log(response);
      navigation.navigate('Home', { name: username });
    });
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    },
    title: {
      color: "white",
      fontSize: 42,
      fontFamily: 'Zapfino'
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalTitle: {
      color: "black",
      fontSize: 28,
      fontFamily: "Zapfino"
    },
    TextInput: {
      fontSize: 20,
      margin: 16
    },
    loginBtn: {
      width:"80%",
      borderRadius: 25,
      alignItems:"center",
      justifyContent:"center",
      backgroundColor:"#003f5c",
      margin: 16,
      width: 200
    },
    loginText: {
      color: "white",
      padding: 25,
      fontSize: 20,
    }
  });

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/background-img.jpg')} resizeMode="cover" style={styles.image}>
        {
          !loginModalVisible && !createModalVisible &&
          <View>
            <Text style={styles.title}>Audio Odyssey</Text>
            <View style={styles.buttons}>
              <Button color="white" title="Log In" onPress={() => {setLoginModalVisible(true)}}/>
              <Button color="white" title="Create Account" onPress={() => {setCreateModalVisible(true)}}/>
            </View>
          </View>
        }
        <Modal
          animationType="fade"
          transparent={true}
          visible={loginModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setLoginModalVisible(false)}>
                <Text style={styles.modalTitle}>Audio Odyssey</Text>
              </TouchableOpacity>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Username"
                  placeholderTextColor="#003f5c"
                  onChangeText={(username) => setUsername(username)}
                />
              </View>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Password"
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                />
              </View>
              <TouchableOpacity style={styles.loginBtn} onPress={() => { setLoginModalVisible(false); navigation.navigate('Home', { name: username }); }}> 
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>

              <View style={{alignItems: 'center'}}>
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={() => {setLoginModalVisible(false); setCreateModalVisible(true)}}>
                  <Text style={{color: "#003f5c"}}>Create account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={createModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Text style={styles.modalTitle}>Audio Odyssey</Text>
              </TouchableOpacity>
                
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder="First name"
                  placeholderTextColor="#003f5c"
                  onChangeText={(firstname) => setFirstname(firstname)}
                />
              </View>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Last name"
                  placeholderTextColor="#003f5c"
                  onChangeText={(lastname) => setLastname(lastname)}
                />
              </View>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Phone number"
                  placeholderTextColor="#003f5c"
                  onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                />
              </View>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Username"
                  placeholderTextColor="#003f5c"
                  onChangeText={(username) => setUsername(username)}
                />
              </View>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Password"
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                />
              </View>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Confirm password"
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                />
              </View>

              <TouchableOpacity style={styles.loginBtn} onPress={() => { setCreateModalVisible(false); createAccount(); }}> 
                <Text style={styles.loginText}>Create Account</Text>
              </TouchableOpacity>
              <View style={{alignItems: 'center'}}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={() => {setCreateModalVisible(false); setLoginModalVisible(true);}}>
                  <Text style={{color: "#003f5c"}}>Log in</Text>
                </TouchableOpacity>
              </View>
            </View>            
          </View>
        </Modal>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}
