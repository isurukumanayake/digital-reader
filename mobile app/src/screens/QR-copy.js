import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Sound from 'react-native-sound';
import audioPath from '../constants/audioPath';
import imagePath from '../constants/imagePath';

const QRScanner = () => {
  const [sounds, setSounds] = useState({});
  const [prev, setPrev] = useState(null);

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
      //   otherSound2: new Sound(
      //     audioPath.otherSound2,
      //     Sound.MAIN_BUNDLE,
      //     error => {
      //       if (error) {
      //         console.log('Error loading otherSound2:', error);
      //       }
      //     },
      //   ),
      // Add more sounds here as needed
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
    // Determine which sound to play based on conditions
    if (prev != data) {
      playSound('welcome');
      alert('Welcome' + data);
    } else {
      playSound('thankyou');
      alert('Thank you' + data);
    }
    // else if (/* condition2 */) {
    //   playSound('otherSound1');
    // } else if (/* condition3 */) {
    //   playSound('otherSound2');
    // }
    // You can add more conditions and corresponding sounds as needed

    // You can also add other logic here if needed
    // alert(data); // Show an alert with the QR code data

    setPrev(data);
  };

  return (
    <QRCodeScanner
      onRead={onQRCodeRead}
      reactivate={true}
      reactivateTimeout={500}
      showMarker={true}
      topContent={
        <View>
          <Text style={styles.heading}>Digital Token Scanner</Text>
        </View>
      }
      bottomContent={
        <View style={styles.bottomContainer}>
          <Image source={imagePath.location2} style={styles.icon} />
          <Text style={styles.bottomText}>Location</Text>
        </View>
      }
    />
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
