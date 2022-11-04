import React, { useState } from 'react';
import { TextInput, Modal, View, Text, TouchableOpacity } from 'react-native';

export default function AccountSettings({ route }) {

  const [firstnameModalVisible, setFirstnameModalVisible] = useState(false);
  const [lastnameModalVisible, setLastnameModalVisible] = useState(false);
  const [phonenumberModalVisible, setPhonenumberModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [firstname, setFirstname] = useState(route.params.firstname);
  const [lastname, setLastname] = useState(route.params.lastname);
  const [phonenumber, setPhonenumber] = useState(route.params.phonenumber);
  const [oldPassword, setOldPassword] = useState(route.params.password);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const saveUser = () => {
    setFirstnameModalVisible(false);
    setLastnameModalVisible(false);
    setPhonenumberModalVisible(false);
    setPasswordModalVisible(false);
  }

  const styles = {
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
    },
    header: {
      fontSize: 25,
      margin: 10
    },
    container: {
      margin: 10
    }
  }

  return (
    <View>
      <Text style={styles.header}>Edit account information</Text>
      <View>
        <View style = {styles.container}>
          <Text>First Name</Text>
          <TouchableOpacity onPress={() => {setFirstnameModalVisible(true)}}>
            <Text style={{fontSize: 20}}>{ firstname }</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={firstnameModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder={route.params.firstname}
                  placeholderTextColor="#003f5c"
                  onChangeText={(firstname) => setFirstname(firstname)}
                />
              </View>
              <TouchableOpacity style={styles.loginBtn} onPress={() => saveUser()}> 
                <Text style={styles.loginText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.container}>
          <Text>Last Name</Text>
          <TouchableOpacity onPress={() => {setLastnameModalVisible(true)}}>
            <Text style={{fontSize: 20}}>{ lastname }</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={lastnameModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder={route.params.lastname}
                  placeholderTextColor="#003f5c"
                  onChangeText={(lastname) => setLastname(lastname)}
                />
              </View>
              <TouchableOpacity style={styles.loginBtn} onPress={() => saveUser()}> 
                <Text style={styles.loginText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.container}>
          <Text>Phone Number</Text>
          <TouchableOpacity onPress={() => {setPhonenumberModalVisible(true)}}>
            <Text style={{fontSize: 20}}>{ phonenumber }</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={phonenumberModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder={route.params.phonenumber}
                  placeholderTextColor="#003f5c"
                  onChangeText={(phonenumber) => setPhonenumber(phonenumber)}
                />
              </View>
              <TouchableOpacity style={styles.loginBtn} onPress={() => saveUser()}> 
                <Text style={styles.loginText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.container}>
          <TouchableOpacity onPress={() => {setPasswordModalVisible(true)}}>
            <Text style={{fontSize: 20}}>Change Password</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={passwordModalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Old password"
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={(oldPassword) => setOldPassword(oldPassword)}
                />
                <TextInput
                  style={styles.TextInput}
                  placeholder="New password"
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={(newPassword) => setNewPassword(newPassword)}
                />
                <TextInput
                  style={styles.TextInput}
                  placeholder="Confirm new password"
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={(confirmNewPassword) => setConfirmNewPassword(confirmNewPassword)}
                />
              </View>
              <TouchableOpacity style={styles.loginBtn} onPress={() => saveUser()}> 
                <Text style={styles.loginText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}
