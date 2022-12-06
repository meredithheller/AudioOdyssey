import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, Modal, TouchableOpacity, Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

function Buddy(firstName='', lastName='', phoneNumber='') {
  this.firstName = firstName;
  this.lastName = lastName;
  this.phoneNumber = phoneNumber;
}

export default function WrappedPage({ navigation }) {

  const [position, setPosition] = useState(0);
  const [ totalMinutes, setTotalMinutes ] = useState(0)
  const [ errorMinutes, setErrorMinutes ] = useState(false)
  const [ loadingMinutes, setLoadingMinutes ] = useState(true)
  const [ topCategory, setTopCategory ] = useState()
  const [ errorCategory, setErrorCategory ] = useState(false)
  const [ loadingCategory, setLoadingCategory ] = useState(true)
  const [ percentile, setPercentile ] = useState()
  const [ buddy, setBuddy ] = useState(new Buddy())
  const [ errorBuddy, setErrorBuddy ] = useState(false)
  const [ loadingBuddy, setLoadingBuddy ] = useState(true)

  function openUrl(url) {
    return Linking.openURL(url);
  }
  
  function openSmsUrl(name, phone) {
    let body  = `Hi there ${name}! This is ${global.user.firstname} ${global.user.lastname}. I found your number on Audio Odyssey. We seem to have similar interests! Wanna go on a road trip with me?`; 
    return openUrl(`sms:${phone}&body=${body}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      const minuteRes = await fetch(`http://db8.cse.nd.edu:${global.port}/wrapped/minutes?` + new URLSearchParams({
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
      const categoryRes = await fetch(`http://db8.cse.nd.edu:${global.port}/wrapped/category?` + new URLSearchParams({
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
      const buddyRes = await fetch(`http://db8.cse.nd.edu:${global.port}/wrapped/buddy?` + new URLSearchParams({
        username: global.user.username
      }))
      if( buddyRes.status == 200) {
        let data = await buddyRes.json()
        let their_buddy = new Buddy(data.firstName, data.lastName, data.phone);
        setBuddy(their_buddy);
        setLoadingBuddy(false);
      }else{
        setErrorBuddy(true);
        setLoadingBuddy(false);
      }
    }
    fetchData();
  }, [])

  function changeSlide() {
    setPosition(position + 1);
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
          visible={position == 3}
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
          visible={position == 4}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              { errorBuddy ? <Text style={styles.caption}>There was an error getting your podcast buddy.</Text>
              : <View>
                <Ionicons style={{alignSelf: 'center'}} name="people" size={75} />
                { loadingBuddy ? 
                  <Text style={styles.caption}> Loading Road Trip Buddy</Text> : 
                  <View style={{alignItems: 'center'}}>
                    <Text style={{...styles.caption}}>Your Road Trip Buddy</Text>
                    <Text>{buddy.firstName} {buddy.lastName}</Text>
                    <TouchableOpacity onPress={() => openSmsUrl(buddy.firstName, buddy.phoneNumber)}>
                      <Text style={styles.phoneNumber}>{buddy.phoneNumber}</Text>
                    </TouchableOpacity>
                  </View>
                }
              </View>}
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={position > 4}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalViewSummary}>
              <Text style={styles.summaryTitle}>Audio Odyssey</Text>
              <View style={styles.row}>
                <Text>Minutes</Text>
                <Text>{Math.round(totalMinutes)}</Text>
              </View>
              <View style={styles.row}>
                <Text>Top Category</Text>
                <Text>{topCategory}</Text>
              </View>
              <View style={styles.row}>
                <Text>{topCategory} Percentile</Text>
                <Text>{percentile}</Text>
              </View>
              <View style={styles.row}>
                <Text>Buddy</Text>
                <View style={{alignItems: 'center'}}>
                  <Text>{buddy.firstName} {buddy.lastName}</Text>
                  <TouchableOpacity onPress={() => openSmsUrl(buddy.firstName, buddy.phoneNumber)}>
                    <Text style={styles.phoneNumber}>{buddy.phoneNumber}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile Home')}>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
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
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Zapfino',
    fontWeight: 'bold'
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
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  },
  phoneNumber: {
    color: 'blue' 
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomColor: 'black',
    paddingBottom: 30
  },
  modalViewSummary: {
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
    height: '40%',
    width: '80%'
  },
  button: {
    width:"80%",
    borderRadius: 10,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#003f5c",
    width: 100
  },
  buttonText: {
    color: 'white',
    padding: 10
  }
});