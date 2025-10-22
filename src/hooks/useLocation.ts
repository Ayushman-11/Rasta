import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';
import { Location as LocationType } from '../types';
import { DEFAULT_LOCATION } from '../constants/mockData';

/**
 * Hook to manage user location with permissions
 */
export const useLocation = () => {
  const [location, setLocation] = useState<LocationType>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Permission to access location was denied. Using default location.'
        );
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Failed to get location');
      setLoading(false);
    }
  };

  return { location, loading, error, requestLocationPermission };
};
