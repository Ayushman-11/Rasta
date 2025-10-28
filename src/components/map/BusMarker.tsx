import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { BusData } from '../../types';

interface BusMarkerProps {
  bus: BusData;
  isSelected: boolean;
  onPress: (bus: BusData) => void;
}

// Helper to calculate bearing between two points
function getBearing(start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }) {
  const toRad = (deg: number) => deg * Math.PI / 180;
  const toDeg = (rad: number) => rad * 180 / Math.PI;
  const dLon = toRad(end.longitude - start.longitude);
  const lat1 = toRad(start.latitude);
  const lat2 = toRad(end.latitude);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let brng = Math.atan2(y, x);
  brng = toDeg(brng);
  return (brng + 360) % 360;
}

// ...existing code...

export function BusMarker({ bus, isSelected, onPress }: BusMarkerProps) {
  // Improved direction logic: find nearest route point, use next for bearing
  let rotation = 0;
  if (bus.coordinates && bus.coordinates.length > 1) {
    // Find nearest route coordinate to bus's current location
    const getDistance = (a, b) => {
      const dx = a.latitude - b.latitude;
      const dy = a.longitude - b.longitude;
      return dx * dx + dy * dy;
    };
    let nearestIdx = 0;
    let minDist = Infinity;
    bus.coordinates.forEach((c, idx) => {
      const dist = getDistance(c, { latitude: bus.latitude, longitude: bus.longitude });
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = idx;
      }
    });
    // Use next point for bearing if possible
    if (nearestIdx < bus.coordinates.length - 1) {
      rotation = getBearing(bus.coordinates[nearestIdx], bus.coordinates[nearestIdx + 1]);
    } else if (nearestIdx > 0) {
      rotation = getBearing(bus.coordinates[nearestIdx - 1], bus.coordinates[nearestIdx]);
    }
  }

  return (
    <Marker
      key={bus.id}
      coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
      onPress={() => onPress(bus)}
      anchor={{ x: 0.5, y: 0.5 }}
      rotation={rotation}
      flat={true}
    >
      <View style={[styles.busContainer, isSelected && styles.busContainerSelected]}>
        {/* Use bus clipart image, rotated by direction */}
        <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
          <Image
            source={require('../../assets/illustrations/red-bus.png')}
            style={{ width: 48, height: 28, resizeMode: 'contain' }}
            accessibilityLabel="Bus marker"
          />
        </View>
        {/* Route label */}
        <View style={styles.busLabel}>
          <Text style={styles.busRoute}>{bus.route}</Text>
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  busContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  busContainerSelected: {
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  busLabel: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  busRoute: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
});
