import {PermissionsAndroid} from 'react-native';

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === 'granted') {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const reverseGeocode = async (latitude, longitude) => {
  const GOOGLE_GEOCODING_API_KEY = 'YOUR_GOOGLE_API_KEY';

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_GEOCODING_API_KEY}`,
    );
    const data = await response.json();
    // console.log(data);

    if (data.results.length > 0) {
      const addressComponents = data.results[2].address_components;
      const cityComponent = addressComponents.find(component => {
        return component.types.includes('locality');
      });

      if (cityComponent) {
        return cityComponent.long_name; // Returns the city name
      } else {
        return 'City not found';
      }
    } else {
      return 'Location not found';
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'Error fetching location';
  }
};
