
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { theme } from '../constants/theme';

import { BusData } from '../types';

interface ShareMyBusScreenProps {
  navigation: any;
  onShare?: (bus: BusData) => void;
}

export default function ShareMyBusScreen({ navigation, onShare }: ShareMyBusScreenProps) {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [crowd, setCrowd] = useState<'low' | 'medium' | 'high' | null>(null);
  const [banner, setBanner] = useState('');

  // Share logic: get current location and mock send
  const handleShare = async () => {
    if (!destination || !crowd || !banner) {
      Alert.alert('Please fill all fields');
      return;
    }
    let location = null;
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }
      location = await Location.getCurrentPositionAsync({});
    } catch (e) {
      Alert.alert('Could not get location');
      return;
    }
    // Build shared bus object
    const bus: BusData = {
      id: 'shared-bus-' + Date.now(),
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
      route: banner,
      passengers: 1,
      estimatedTime: '',
      startPoint: start || 'Current Location',
      destination,
      currentLocation: start || 'Current Location',
      stops: [],
      coordinates: [
        { latitude: location?.coords.latitude, longitude: location?.coords.longitude },
        // For now, just use destination as a single point; real app would use Directions API
        { latitude: location?.coords.latitude + 0.002, longitude: location?.coords.longitude + 0.002 },
      ],
      crowd: crowd,
    } as any;
    if (onShare) onShare(bus);
    Alert.alert('Bus shared!', 'Your live location is now being tracked.');
    navigation.goBack && navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Bus Journey</Text>
      <Text style={styles.label}>Start Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter or pick start location"
        value={start}
        onChangeText={setStart}
      />
      <Text style={styles.label}>Destination</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter or pick destination"
        value={destination}
        onChangeText={setDestination}
      />
      <Text style={styles.label}>Crowd Level</Text>
      <View style={styles.crowdRow}>
        <TouchableOpacity style={[styles.crowdBtn, crowd==='low' && styles.crowdSelected]} onPress={()=>setCrowd('low')}><Text>Low</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.crowdBtn, crowd==='medium' && styles.crowdSelected]} onPress={()=>setCrowd('medium')}><Text>Medium</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.crowdBtn, crowd==='high' && styles.crowdSelected]} onPress={()=>setCrowd('high')}><Text>High</Text></TouchableOpacity>
      </View>
      <Text style={styles.label}>Bus Banner (Route)</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g. Rankala → ST Stand"
        value={banner}
        onChangeText={setBanner}
      />
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <Text style={styles.shareBtnText}>Share Live Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background.primary, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  label: { marginTop: 16, marginBottom: 4, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: theme.colors.border.medium, borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  crowdRow: { flexDirection: 'row', gap: 12, marginVertical: 8 },
  crowdBtn: { borderWidth: 1, borderColor: theme.colors.border.medium, borderRadius: 8, padding: 10, backgroundColor: '#eee' },
  crowdSelected: { backgroundColor: theme.colors.primary + '22', borderColor: theme.colors.primary },
  shareBtn: { marginTop: 32, backgroundColor: theme.colors.primary, borderRadius: 8, padding: 16, alignItems: 'center' },
  shareBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
