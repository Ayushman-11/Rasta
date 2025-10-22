import { useState, useRef } from 'react';
import { PanResponder } from 'react-native';
import MapView from 'react-native-maps';
import { BusData } from '../types';
import { MAP_CONFIG } from '../constants/mockData';

/**
 * Hook to manage bus selection and navigation
 */
export const useBusNavigation = (buses: BusData[]) => {
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [selectedBusIndex, setSelectedBusIndex] = useState<number>(-1);
  const mapRef = useRef<MapView>(null);

  const focusOnBus = (bus: BusData, index: number) => {
    setSelectedBus(bus);
    setSelectedBusIndex(index);
    mapRef.current?.animateToRegion({
      latitude: bus.latitude,
      longitude: bus.longitude,
      ...MAP_CONFIG.FOCUSED_ZOOM,
    }, MAP_CONFIG.ANIMATION_DURATION);
  };

  const handleBusMarkerPress = (bus: BusData) => {
    const index = buses.findIndex(b => b.id === bus.id);
    focusOnBus(bus, index);
  };

  const handleBusCardPress = (bus: BusData) => {
    const index = buses.findIndex(b => b.id === bus.id);
    focusOnBus(bus, index);
  };

  const handlePreviousBus = () => {
    const newIndex = selectedBusIndex === 0 ? buses.length - 1 : selectedBusIndex - 1;
    const newBus = buses[newIndex];
    focusOnBus(newBus, newIndex);
  };

  const handleNextBus = () => {
    const newIndex = selectedBusIndex === buses.length - 1 ? 0 : selectedBusIndex + 1;
    const newBus = buses[newIndex];
    focusOnBus(newBus, newIndex);
  };

  const closeBusDetails = () => {
    setSelectedBus(null);
    setSelectedBusIndex(-1);
  };

  const handleLocationClick = (userLocation: { latitude: number; longitude: number }) => {
    mapRef.current?.animateToRegion({
      ...userLocation,
      ...MAP_CONFIG.DEFAULT_ZOOM,
    }, MAP_CONFIG.ANIMATION_DURATION);
  };

  // Swipe gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          handlePreviousBus();
        } else if (gestureState.dx < -50) {
          handleNextBus();
        }
      },
    })
  ).current;

  return {
    selectedBus,
    selectedBusIndex,
    mapRef,
    panResponder,
    handleBusMarkerPress,
    handleBusCardPress,
    handlePreviousBus,
    handleNextBus,
    closeBusDetails,
    handleLocationClick,
    setSelectedBus,
  };
};
