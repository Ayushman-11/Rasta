import React from 'react';
import { Marker } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';

export function DestinationMarker({ coordinate }: { coordinate: { latitude: number; longitude: number } }) {
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 1 }}>
      <MapPin color="#fbbf24" size={32} />
    </Marker>
  );
}
