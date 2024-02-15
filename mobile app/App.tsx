import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from './src/screens/Home';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Location from './src/screens/Location';
import BusConfig from './src/screens/BusConfig';
import QRScanner from './src/screens/QRScanner';
import {BusProvider} from './src/contexts/BusContext';
import BusDetails from './src/screens/BusDetails';

const Stack = createStackNavigator();

const App = () => {
  return (
    <BusProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="home" component={Home} />
          <Stack.Screen name="qrscanner" component={QRScanner} />
          <Stack.Screen name="location" component={Location} />
          <Stack.Screen name="busconfig" component={BusConfig} />
          <Stack.Screen name="busdetails" component={BusDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </BusProvider>
  );
};

export default App;
