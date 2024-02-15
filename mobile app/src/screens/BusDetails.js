import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import apiClient from '../api/client';
import BusContext from '../contexts/BusContext';
import Toast from 'react-native-toast-message';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
  },
};

const BusDetails = ({navigation}) => {
  const {state, setState} = useContext(BusContext);

  const [start, setStart] = useState(state.route?.split('-')[0].trim());
  const [destination, setDestination] = useState(
    state.route?.split('-')[1].trim(),
  );
  const [routeNo, setRouteNo] = useState(state.routeNo);

  const handleFetchData = () => {
    if (
      start.trim() === '' ||
      destination.trim() === '' ||
      routeNo.trim() === ''
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
        visibilityTime: 2000,
      });
    } else {
      setState({
        ...state,
        routeNo: routeNo,
        route: `${start}-${destination}`,
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Route configured',
        visibilityTime: 2000,
      });
    }
  };

  const handleReset = () => {
    setStart('');
    setDestination('');
    setRouteNo('');
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Start</Text>
          <TextInput
            style={styles.input}
            value={start}
            onChangeText={text => setStart(text)}
          />
          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={text => setDestination(text)}
          />

          <Text style={styles.label}>Route</Text>
          <TextInput
            style={styles.input}
            value={routeNo}
            onChangeText={text => setRouteNo(text)}
          />

          <Button
            mode="contained"
            onPress={handleFetchData}
            style={styles.saveButton}
            labelStyle={styles.buttonText}>
            Save
          </Button>

          <Button
            mode="contained"
            onPress={handleReset}
            style={styles.resetButton}
            labelStyle={styles.buttonText}>
            Reset
          </Button>
        </View>
      </View>
      <Toast />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  img: {
    height: 160,
    width: 160,
    alignSelf: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    marginBottom: 8,
  },
  input: {
    marginBottom: 24,
    backgroundColor: '#f0f0f0',
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 4,
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: 'gray',
    borderRadius: 8,
    padding: 4,
    marginTop: 15,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default BusDetails;
