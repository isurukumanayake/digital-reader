import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Sound from 'react-native-sound';
import Geolocation from 'react-native-geolocation-service';
import audioPath from '../constants/audioPath';
import imagePath from '../constants/imagePath';
import {requestLocationPermission, reverseGeocode} from './LocationUtil';
import apiClient from '../api/client';
import {
  AlertNotificationRoot,
  Dialog,
  Toast,
  ALERT_TYPE,
} from 'react-native-alert-notification';
import BusContext from '../contexts/BusContext';

const QRScanner = () => {
  const [sounds, setSounds] = useState({});

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const {state, setState} = useContext(BusContext);

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('Location permission denied');
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
      },
      error => {
        setError(`Error: ${error.message}`);
        setLocation(null);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // Use useEffect to start the location updates when the component mounts
  useEffect(() => {
    const locationUpdateInterval = setInterval(getLocation, 2000); // Update every 2 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(locationUpdateInterval);
  }, []);

  useEffect(() => {
    // Load all your audio files when the component mounts
    const soundObjects = {
      welcome: new Sound(audioPath.welcome, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Error loading welcome sound:', error);
        }
      }),
      thankyou: new Sound(audioPath.thankyou, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Error loading thankyou sound:', error);
        }
      }),
      warning: new Sound(audioPath.warning, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Error loading warning sound:', error);
        }
      }),
      invaliduser: new Sound(
        audioPath.invaliduser,
        Sound.MAIN_BUNDLE,
        error => {
          if (error) {
            console.log('Error loading invaliduser sound:', error);
          }
        },
      ),
      creditlimit: new Sound(
        audioPath.creditlimit,
        Sound.MAIN_BUNDLE,
        error => {
          if (error) {
            console.log('Error loading creditlimit sound:', error);
          }
        },
      ),
    };

    setSounds(soundObjects);

    return () => {
      // Release all sound resources when the component unmounts
      for (const key in soundObjects) {
        if (soundObjects[key]) {
          soundObjects[key].release();
        }
      }
    };
  }, []);

  const playSound = soundKey => {
    // Play the sound based on the provided soundKey
    const sound = sounds[soundKey];
    if (sound) {
      sound.play(success => {
        if (success) {
          console.log(`Sound ${soundKey} played successfully`);
        } else {
          console.log(`Sound ${soundKey} playback failed`);
        }
      });
    }
  };

  const onQRCodeRead = ({data}) => {
    apiClient
      .get('/users/' + data)
      .then(response => {
        if (response.status === 200) {
          if (response.data.balance < 0) {
            Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: 'Warning',
              textBody: 'Credit limit exceeded',
              button: 'Close',
            });
            playSound('creditlimit');
          } else {
            apiClient
              .get('/journeys/users/ongoing/' + data)
              .then(response => {
                if (response.data.length === 0) {
                  const journey = {
                    start: location.address,
                    user: data,
                    busId: state.busId,
                    busType: state.busType,
                    route: state.route,
                    routeNo: state.routeNo,
                  };
                  apiClient
                    .post('/journeys', journey)
                    .then(response => {
                      if (response.status === 200) {
                        Dialog.show({
                          type: ALERT_TYPE.SUCCESS,
                          title: 'Success',
                          textBody: 'Journey started',
                          button: 'Close',
                        });
                        playSound('welcome');
                      }
                    })
                    .catch(error => {
                      console.error(error);
                    });
                } else if (response.data.length === 1) {
                  apiClient
                    .put('/journeys/' + response.data[0].id, {
                      end: location.address,
                    })
                    .then(res => {
                      if (res.status === 200) {
                        Dialog.show({
                          type: ALERT_TYPE.SUCCESS,
                          title: 'Success',
                          textBody: 'Journey ended',
                          button: 'Close',
                        });
                        playSound('thankyou');
                      }
                    })
                    .catch(error => {
                      console.error(error);
                    });
                } else if (response.data.length > 1) {
                  Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Warning',
                    textBody:
                      'Please complete your ongoing journey before starting a new one',
                    button: 'Close',
                  });
                  playSound('warning');
                } else {
                  // alert('Unexpected response from the server');
                  Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Error',
                    textBody: 'Unexpected response from the server',
                    button: 'Close',
                  });
                }
              })
              .catch(error => {
                console.error(error);
                // alert('Network request failed');
                Dialog.show({
                  type: ALERT_TYPE.DANGER,
                  title: 'Error',
                  textBody: 'Network request failed',
                  button: 'Close',
                });
              });
          }
        }
      })
      .catch(error => {
        console.error(error);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Invalid user',
          button: 'Close',
        });
        playSound('invaliduser');
      });
  };

  return (
    <AlertNotificationRoot>
      <QRCodeScanner
        onRead={onQRCodeRead}
        reactivate={true}
        reactivateTimeout={6000}
        showMarker={true}
        topContent={
          <View>
            <Text style={styles.heading}>Digital Token Scanner</Text>
          </View>
        }
        bottomContent={
          <View style={styles.bottomContainer}>
            <Image source={imagePath.location2} style={styles.icon} />
            <Text style={styles.bottomText}>
              {location ? location.address : 'Location'}
            </Text>
          </View>
        }
      />
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    marginBottom: 50,
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 50,
  },
  icon: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  bottomText: {
    fontSize: 16,
  },
});

export default QRScanner;
