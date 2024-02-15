import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, ActivityIndicator, Image} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {requestLocationPermission, reverseGeocode} from './LocationUtil';
import imagePath from '../constants/imagePath';

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('Location permission denied');
      setIsLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        setError(null);
        const address = await reverseGeocode(
          position.coords.latitude,
          position.coords.longitude,
        );
        setLocation({...position, address});
        setIsLoading(false);
      },
      error => {
        setError(`Error: ${error.message}`);
        setLocation(null);
        setIsLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    const locationUpdateInterval = setInterval(getLocation, 2000);

    return () => clearInterval(locationUpdateInterval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Live Location</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : location ? (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>Latitude</Text>
          <Text style={styles.locationValue}>{location.coords.latitude}</Text>
          <Text style={styles.locationText}>Longitude</Text>
          <Text style={styles.locationValue}>{location.coords.longitude}</Text>
          <Text style={styles.locationText}>City</Text>
          <Text style={styles.locationValue}>{location.address}</Text>
          <Image source={imagePath.location} style={styles.locationIcon} />
        </View>
      ) : (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF',
  },
  locationInfo: {
    width: 300,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 3,
  },
  locationText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  locationValue: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 25,
  },
  locationIcon: {
    width: 60,
    height: 60,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Location;
