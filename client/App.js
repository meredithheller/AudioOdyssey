import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './LandingPage';
import HomeScreen from './HomeScreen';

const Stack = createNativeStackNavigator();

function App() {

  /*const [data, setData] = useState([{}])

  // Get Json object from flask server
  useEffect(() => {
    fetch("http://127.0.0.1:5001/podcasts").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    ).catch(

    )
  }, [])*/

  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="Landing">
        <Stack.Screen options={{ headerShown: false }} name="Landing" component={LandingPage} />
        <Stack.Screen options={{ gestureEnabled: false, headerBackVisible: false }} name="Home" component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
