import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { BusData } from '../../types';
import { Svg, Circle as SvgCircle } from 'react-native-svg';

interface BusMarkerProps {
  bus: BusData;
  isSelected: boolean;
  onPress: (bus: BusData) => void;
  size: number; // New prop for dynamic sizing
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

export function BusMarker({ bus, isSelected, onPress, size }: BusMarkerProps) {
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
      <View style={[styles.markerContainer, { width: size, height: size }]}> {/* Adjust size dynamically */}
        <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
          <Image
            source={require('../../assets/illustrations/red-bus.png')}
            style={[styles.busImage, { width: size, height: size }]} // Adjust size dynamically
            accessibilityLabel="Bus marker"
          />
          <Text style={[styles.busNoText, { fontSize: size / 3 }]}>{bus.route}</Text> {/* Adjust text size dynamically */}
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  busImage: {
    borderRadius: 12,
  },
  busNoText: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#d32f2f',
  },
});
