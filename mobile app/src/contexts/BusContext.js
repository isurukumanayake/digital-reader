import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BusContext = createContext();

export const BusProvider = ({children}) => {
  const [state, setState] = useState({
    busId: null,
    busType: null,
    route: null,
    routeNo: null,
  });

  // Load the initial state from AsyncStorage when the component mounts
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('busState');
        if (savedState) {
          setState(JSON.parse(savedState));
        }
      } catch (error) {
        console.error('Error loading state from AsyncStorage:', error);
      }
    };
    loadState();
  }, []);

  // Save the state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('busState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state to AsyncStorage:', error);
      }
    };
    saveState();
  }, [state]);

  return (
    <BusContext.Provider value={{state, setState}}>
      {children}
    </BusContext.Provider>
  );
};

export default BusContext;
