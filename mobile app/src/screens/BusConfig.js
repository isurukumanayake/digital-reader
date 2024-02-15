import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  TextInput,
  Button,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import apiClient from '../api/client';
import imagePath from '../constants/imagePath';
import BusContext from '../contexts/BusContext';
import Toast from 'react-native-toast-message';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
  },
};

const BusConfig = ({navigation}) => {
  const {state, setState} = useContext(BusContext);

  const [busId, setBusId] = useState(state.busId);
  const [securityCode, setSecurityCode] = useState('');

  const handleConfigure = () => {
    if (busId.trim() === '' || securityCode.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
        visibilityTime: 2000,
      });
    } else {
      apiClient
        .get('/bus/' + busId)
        .then(response => {
          if (
            response.status == 200 &&
            response.data.securityCode == securityCode
          ) {
            setState({...state, busId: busId, busType: response.data.busType});
            navigation.navigate('busdetails');
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Invalid credentials',
              visibilityTime: 2000,
            });
          }
        })
        .catch(error => {
          console.error(error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Network request failed',
            visibilityTime: 2000,
          });
        });
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Image source={imagePath.bus} style={styles.img} />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bus ID</Text>
          <TextInput
            style={styles.input}
            value={busId}
            onChangeText={text => setBusId(text)}
            autoCapitalize="characters"
          />
          <Text style={styles.label}>Security Code</Text>
          <TextInput
            style={styles.input}
            value={securityCode}
            onChangeText={text => setSecurityCode(text)}
            secureTextEntry
            keyboardType="numeric"
          />

          <Button
            mode="contained"
            onPress={handleConfigure}
            style={styles.button}
            labelStyle={styles.buttonText}>
            Configure
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
  button: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 4,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default BusConfig;
