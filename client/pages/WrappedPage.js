import React, {useState} from 'react';
import { View, StyleSheet, ImageBackground, Text, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function WrappedPage({ navigation }) {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      flex: 1,
      alignItems: 'center',
      width: '100%',
      opacity: 1
    },
    title: {
      fontSize: 30,
      fontFamily: 'Zapfino',
      fontWeight: 'bold',
    },
    wrapped: {
      color: 'black',
      textTransform: 'uppercase',
      fontSize: 36 ,
      textAlign: 'center'
    },
    tap: {
      margin: 25,
      textAlign: 'center'
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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
      elevation: 5,
      justifyContent: 'space-between',
      height: '30%',
      width: '60%'
    },
    modalViewTitle: {
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
    number: {
      fontSize: 50,
      textAlign: 'center'
    },
    caption: {
      fontSize: 20,
      textAlign: 'center'
    }
  });

  function changeSlide() {
    setPosition(position + 1);
    if (position == 5) {
      navigation.navigate("Profile Home");
    }
  }

  let [position, setPosition] = useState(0);

  return (
    <View style={styles.container} onTouchEnd={changeSlide}>
      <ImageBackground source={require('../assets/wrapped-img.jpg')} resizeMode="cover" style={styles.image}>
        <Modal 
          animationType="fade"
          transparent={true}
          visible={position == 0}>
            <View style={styles.centeredView}>
              <View style={styles.modalViewTitle}>
                <Text style={styles.title}>Audio Odyssey</Text>
                <Text style={styles.wrapped}>Wrapped</Text>
                <Text style={styles.tap}>Tap to review your previous year on Audio Odyssey</Text>
              </View>
            </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={position == 1}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Ionicons name="headset" size={75} />
              <Text style={styles.number}>123</Text>
              <Text style={styles.caption}>Podcast Minutes</Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={position == 2}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Ionicons name="car" size={75} />
              <Text style={styles.number}>1240</Text>
              <Text style={styles.caption}>Miles Driven</Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={position == 3}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Ionicons name="trophy" size={75} />
              <Text style={styles.number}>Islam</Text>
              <Text style={styles.caption}>Top Category</Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={position == 4}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Ionicons name="trending-up" size={75} />
              <Text style={styles.number}>99%</Text>
              <Text style={styles.caption}>Percentile of Islam listeners</Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={position == 5}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Ionicons name="people" size={75} />
              <Text style={styles.caption}>Suggested Road Trip Buddy</Text>
              <View>
                <Text>LeBron</Text>
                <Text>James</Text>
                <Text>123-456-7890</Text>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  )
}