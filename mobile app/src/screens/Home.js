import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import imagePath from '../constants/imagePath';

const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('qrscanner')}>
        <Image source={imagePath.scanner} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Digital Scanner</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('location')}>
        <Image source={imagePath.location} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Location</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('busconfig')}>
        <Image source={imagePath.settings} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Configuration</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    height: 140,
    width: 180,
    margin: 15,
    borderRadius: 10,
  },
  buttonIcon: {
    height: 80,
    width: 80,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});
