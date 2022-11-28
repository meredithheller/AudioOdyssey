import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

function Buddy(name='', phoneNumber='') {
  this.name = name
  this.phoneNumber = phoneNumber;
}


export default function WrappedPage({ navigation }) {

  const [position, setPosition] = useState(0);
  const [ totalMinutes, setTotalMinutes ] = useState(0)
  const [ errorMinutes, setErrorMinutes ] = useState(false)
  const [ loadingMinutes, setLoadingMinutes ] = useState(true)
  const [ miles, setMiles ] = useState(0)
  const [ errorMiles, setErrorMiles ] = useState(false)
  const [ loadingMiles, setLoadingMiles ] = useState(true)
  const [ topCategory, setTopCategory ] = useState()
  const [ errorCategory, setErrorCategory ] = useState(false)
  const [ loadingCategory, setLoadingCategory ] = useState(true)
  const [ percentile, setPercentile ] = useState()
  const [ buddy, setBuddy ] = useState()
  const [ errorBuddy, setErrorBuddy ] = useState(false)
  const [ loadingBuddy, setLoadingBuddy ] = useState(true)

  useEffect(() => {

    const fetchData = async () => {
      const minuteRes = await fetch('http://db8.cse.nd.edu:5006/wrapped/minutes?' + new URLSearchParams({
        username: global.user.username
      }))
      if( minuteRes.status == 200) {
        let data = await minuteRes.text()
        setTotalMinutes(data)
        setLoadingMinutes(false)
      }else{
        setLoadingMinutes(false)
        setErrorMinutes(true)
      }
      const milesRes = await fetch('http://db8.cse.nd.edu:5006/wrapped/miles?' + new URLSearchParams({
        username: global.user.username
      }))
      if( milesRes.status == 200) {
        let data = await milesRes.text()
        setMiles(data)
        setLoadingMiles(false)
      }else{
        setLoadingMiles(false)
        setErrorMiles(true)
      }
      const categoryRes = await fetch('http://db8.cse.nd.edu:5006/wrapped/category?' + new URLSearchParams({
        username: global.user.username
      }))
      if( categoryRes.status == 200) {
        let data = await categoryRes.json()
        setTopCategory(data['topCategory'])
        setPercentile(data['percentile'])
        setLoadingCategory(false)
      }else{
        setLoadingCategory(false)
        setErrorCategory(true)
      }
      const buddyRes = await fetch('http://db8.cse.nd.edu:5006/wrapped/buddy?' + new URLSearchParams({
        username: global.user.username
      }))
      if( buddyRes.status == 200) {
        let data = await buddyRes.json()
        let their_buddy = new Buddy((data.firstName + ' ' + data.lastName), data.phone)
        setBuddy(their_buddy)
        setLoadingBuddy(false)
      }else{
        setLoadingBuddy(false)
        setErrorBuddy(true)
      }
    }

    fetchData()
  }, [])

  function changeSlide() {
    setPosition(position + 1);
    if (position == 5) {
      navigation.navigate("Profile Home");
    }
  }

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
              { errorMinutes ? <Text style={styles.caption}>There was an error getting your wrapped minutes.</Text> : 
              <View>
                <Ionicons style={{alignSelf: 'center'}} name="headset" size={75} />
                <Text style={styles.number}>{ loadingMinutes ? 'Loading' : totalMinutes}</Text>
                <Text style={styles.caption}>Podcast Minutes</Text>
              </View>}
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
              { errorMiles ? <Text style={styles.caption}>There was an error getting your wrapped miles.</Text> : 
              <View>
                <Ionicons style={{alignSelf: 'center'}} name="car" size={75} />
                <Text style={styles.number}>{ loadingMiles ? 'Loading' : miles}</Text>
                <Text style={styles.caption}>Miles Driven</Text>
              </View>}
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
              { errorCategory ? <Text style={styles.caption}>There was an error getting your top category.</Text>
              : <View>
                <Ionicons style={{alignSelf: 'center'}} name="trophy" size={75} />
                <Text style={styles.number}>{ loadingCategory ? 'Loading' : topCategory}</Text>
                <Text style={styles.caption}>Top Category</Text>
              </View>
              }
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
              { errorCategory ? <Text style={styles.caption}>There was an error getting your top category percentile.</Text>
              : <View>
                <Ionicons style={{alignSelf: 'center'}} name="trending-up" size={75} />
                <Text style={styles.number}>{ loadingCategory ? 'Loading' : percentile}</Text>
                <Text style={styles.caption}>Percentile of {topCategory} listeners</Text>
              </View>}
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
              { errorBuddy ? <Text style={styles.caption}>There was an error getting your podcast buddy.</Text>
              : <View>
                <Ionicons style={{alignSelf: 'center'}} name="people" size={75} />
                { loadingBuddy ? <Text style={styles.caption}> Loading Road Trip Buddy</Text> : 
                <View style={{alignItems: 'center'}}>
                  <Text style={{...styles.caption}}>Your Road Trip Buddy</Text>
                  <Text>{buddy.name}</Text>
                  <Text>{buddy.phoneNumber}</Text>
                </View>}
              </View>}
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  )
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
    fontSize: 28,
    textAlign: 'center'
  },
  caption: {
    fontSize: 20,
    textAlign: 'center'
  }
});