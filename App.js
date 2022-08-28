import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen'
import Forecast from './src/pages/Forecast';
import Home from './src/pages/Home';

const App = () => {

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    SplashScreen.hide();
  })
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
        <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
        <Stack.Screen name='Forecast' component={Forecast}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default App;