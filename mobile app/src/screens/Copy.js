import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import apiClient from '../api/client';

const BusConfig = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/journeys/652a075d633a2e57918ec8ef')
      .then(response => {
        setData(response.data.start);
        console.log(response.data.start);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        alert('Network request failed');
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Text style={styles.messageText}>Response: {data}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
