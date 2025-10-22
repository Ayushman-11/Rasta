import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { BusFront } from 'lucide-react-native';
import ModelView from 'react-native-3d-model-view';
import { Asset } from 'expo-asset';
import { BusData } from '../../types';

interface BusMarkerProps {
  bus: BusData;
  isSelected: boolean;
  onPress: (bus: BusData) => void;
}

export function BusMarker({ bus, isSelected, onPress }: BusMarkerProps) {
  return (
    <Marker
      key={bus.id}
      coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
      onPress={() => onPress(bus)}
    >
      <View style={[styles.busIcon, isSelected && styles.busIconSelected]}>
        <BusFront color="#ff0000" strokeWidth={1.75} size={28} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  busMarker: {
    position: 'relative',
  },
  busIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#ffffffff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  busIconSelected: {
    backgroundColor: '#ffffffff',
    borderWidth: 3,
    borderColor: '#ff0101ff',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  busRoute: {
    color: 'white',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
  },
  glView: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
