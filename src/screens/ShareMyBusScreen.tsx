
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, FlatList } from 'react-native';
import * as Location from 'expo-location';
import { theme } from '../constants/theme';
import { KOLHAPUR_LOCATIONS, KOLHAPUR_ROUTES } from '../constants/mockData';
import { v4 as uuidv4 } from 'uuid';

import { BusData } from '../types';

interface ShareMyBusScreenProps {
  navigation: any;
  onShare?: (bus: BusData) => void;
}

export default function ShareMyBusScreen({ navigation, onShare }: ShareMyBusScreenProps) {
  const [start, setStart] = useState('Detecting...');
  const [destination, setDestination] = useState('');
  const [crowd, setCrowd] = useState<'low' | 'medium' | 'high' | null>(null);
  const [banner, setBanner] = useState('');
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);
  const [showBannerPicker, setShowBannerPicker] = useState(false);

  // Auto-detect start location
  useEffect(() => {
    const getStartLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setStart('Permission denied');
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        // Reverse geocode to get address
        // For simplicity, use nearest location from mock
        const nearest = KOLHAPUR_LOCATIONS.reduce((prev, curr) => {
          const prevDist = Math.abs(prev.latitude - location.coords.latitude) + Math.abs(prev.longitude - location.coords.longitude);
          const currDist = Math.abs(curr.latitude - location.coords.latitude) + Math.abs(curr.longitude - location.coords.longitude);
          return currDist < prevDist ? curr : prev;
        });
        setStart(`Near ${nearest.name}`);
      } catch (error) {
        setStart('Current Location');
      }
    };
    getStartLocation();
  }, []);

  // Share logic: real geocoding and route
  const handleShare = async () => {
    if (!destination || !crowd) {
      Alert.alert('Please select destination and crowd level');
      return;
    }
    if (!banner) setBanner('Shared Route'); // Default

    let location = null;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location permission required');
        return;
      }
      location = await Location.getCurrentPositionAsync({});
    } catch (e) {
      Alert.alert('Could not get location');
      return;
    }

    try {
      // Geocode destination
      const destCoords = await geocodeAddress(destination);
      // Fetch route
      const routeCoords = await fetchDirectionsPolyline(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        destCoords
      );

      const bus: BusData = {
        id: uuidv4(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        route: banner,
        passengers: 1,
        estimatedTime: '',
        startPoint: start,
        destination,
        currentLocation: start,
        stops: [],
        coordinates: routeCoords,
        crowd,
      };
      if (onShare) onShare(bus);
      Alert.alert('Shared!', 'Tracking live.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to share. Check address and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Bus</Text>
      <Text style={styles.label}>Start: {start}</Text>
      <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDestinationPicker(true)}>
        <Text>{destination || 'Select Destination'}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Crowd Level</Text>
      <View style={styles.crowdRow}>
        <TouchableOpacity style={[styles.crowdBtn, crowd==='low' && styles.crowdSelected]} onPress={()=>setCrowd('low')}>
          <Text>😊 Low</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.crowdBtn, crowd==='medium' && styles.crowdSelected]} onPress={()=>setCrowd('medium')}>
          <Text>😐 Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.crowdBtn, crowd==='high' && styles.crowdSelected]} onPress={()=>setCrowd('high')}>
          <Text>😟 High</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowBannerPicker(true)}>
        <Text>{banner || 'Select Route'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <Text style={styles.shareBtnText}>Share</Text>
      </TouchableOpacity>

      {/* Destination Picker Modal */}
      <Modal visible={showDestinationPicker} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Select Destination</Text>
          <FlatList
            data={KOLHAPUR_LOCATIONS}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => { setDestination(item.name); setShowDestinationPicker(false); }}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowDestinationPicker(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Banner Picker Modal */}
      <Modal visible={showBannerPicker} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Select Route</Text>
          <FlatList
            data={KOLHAPUR_ROUTES.map(r => r.name)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => { setBanner(item); setShowBannerPicker(false); }}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowBannerPicker(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.primary, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  label: { marginBottom: 8, fontWeight: '600' },
  pickerBtn: { borderWidth: 1, borderColor: theme.colors.border.medium, borderRadius: 8, padding: 12, backgroundColor: '#fff', marginBottom: 16 },
  crowdRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  crowdBtn: { borderWidth: 1, borderColor: theme.colors.border.medium, borderRadius: 8, padding: 12, backgroundColor: '#eee', alignItems: 'center' },
  crowdSelected: { backgroundColor: theme.colors.primary + '22', borderColor: theme.colors.primary },
  shareBtn: { backgroundColor: theme.colors.primary, borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24 },
  shareBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  modal: { flex: 1, backgroundColor: '#fff', padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closeBtn: { marginTop: 16, padding: 12, backgroundColor: '#ccc', borderRadius: 8, alignItems: 'center' },
});
