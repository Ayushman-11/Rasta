import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { View, StyleSheet, Dimensions, Alert, Platform, TouchableOpacity } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { Keyboard } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import LottieView from 'lottie-react-native';

// Hooks
import { useLocation } from '../hooks/useLocation';
import { useBusNavigation } from '../hooks/useBusNavigation';

// Components
import { BusMarker } from '../components/map/BusMarker';
import { DestinationMarker } from '../components/map/DestinationMarker';
// import { BusDetailsCard } from '../components/cards/BusDetailsCard';
import { BusInfoPanel } from '../components/panels/BusInfoPanel';
import { NearbyBusesBadge } from '../components/cards/NearbyBusesBadge';
import { SearchPanel } from '../components/search/SearchPanel';
import { BottomNav } from '../components/navigation/BottomNav';
import { MapControls } from '../components/navigation/MapControls';
import { generateMockBuses, filterBuses } from '../utils/busGenerator';
import { MAP_CONFIG } from '../constants/mockData';
import { BusData } from '../types';
import successAnim from '../assets/animations/success.json';

const { width, height } = Dimensions.get('window');

interface MapScreenProps {
  onBack?: () => void;
  trackLiveBus?: string | null;
  onboardUsers?: BusData[];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  map: {
    width: width,
    height: height,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 100,
  },
});

export default function MapScreen({ onBack, trackLiveBus, onboardUsers = [] }: MapScreenProps) {
  const { location: userLocation } = useLocation();
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Animation state
  const [busProgress, setBusProgress] = useState<{ [busId: string]: number }>({});
  const [showSuccess, setShowSuccess] = useState<{ [busId: string]: boolean }>({});
  const [tripDirection, setTripDirection] = useState<{ [busId: string]: 'forward' | 'reverse' }>({});
  // Route display state - persists even when panel is closed
  const [routeBus, setRouteBus] = useState<BusData | null>(null);

  const {
    selectedBus,
    selectedBusIndex,
    mapRef,
    panResponder,
    handleBusMarkerPress: originalHandleBusMarkerPress,
    handleBusCardPress: originalHandleBusCardPress,
    handlePreviousBus: originalHandlePreviousBus,
    handleNextBus: originalHandleNextBus,
    closeBusDetails: originalCloseBusDetails,
    handleLocationClick,
    setSelectedBus,
  } = useBusNavigation(buses);

  // Wrap the bus selection handlers to also set routeBus
  const handleBusMarkerPress = (bus: BusData) => {
    setRouteBus(bus);
    originalHandleBusMarkerPress(bus);
  };

  const handleBusCardPress = (bus: BusData) => {
    setRouteBus(bus);
    originalHandleBusCardPress(bus);
  };

  const handlePreviousBus = () => {
    originalHandlePreviousBus();
    // Update routeBus to match the new selectedBus
    if (selectedBusIndex >= 0 && buses[selectedBusIndex]) {
      setRouteBus(buses[selectedBusIndex]);
    }
  };

  const handleNextBus = () => {
    originalHandleNextBus();
    // Update routeBus to match the new selectedBus
    if (selectedBusIndex >= 0 && buses[selectedBusIndex]) {
      setRouteBus(buses[selectedBusIndex]);
    }
  };

  const closeBusDetails = () => {
    originalCloseBusDetails();
    // Keep routeBus so the route remains visible
  };

  const clearRoute = () => {
    setRouteBus(null);
  };

  // Focus on bus if trackLiveBus is set
  useEffect(() => {
    if (trackLiveBus && buses.length > 0) {
      // Try to find the bus by route (since busNumber is not a property)
      const bus = buses.find((b) => b.route === trackLiveBus || b.id === trackLiveBus);
      if (bus && typeof setSelectedBus === 'function') {
        setSelectedBus(bus);
        // Optionally, focus the map on the bus marker
        if (mapRef && mapRef.current && bus.latitude && bus.longitude) {
          mapRef.current.animateToRegion({
            latitude: bus.latitude,
            longitude: bus.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    }
  }, [trackLiveBus, buses]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const mockBuses = await generateMockBuses();
        if (!cancelled) {
          setBuses(mockBuses);
          // Reset bus progress to 0 for all buses
          setBusProgress(Object.fromEntries(mockBuses.map((b) => [b.id, 0])));
          setLoading(false);
        }
      } catch (err) {
  // Error loading buses: err
        if (!cancelled) {
          setError(err?.message || 'Failed to load buses');
          setBuses([]);
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [userLocation]);

  // Animate bus movement along its route
  useEffect(() => {
    if (!buses.length) return;
    const interval = setInterval(() => {
      setBusProgress((prev) => {
        const next: typeof prev = { ...prev };
        buses.forEach((bus) => {
          const routeLen = bus.coordinates?.length || 0;
          const direction = tripDirection[bus.id] || 'forward';
          let newProgress = prev[bus.id] || 0;
          if (routeLen > 1) {
            if (direction === 'forward') {
              newProgress = Math.min(newProgress + 1, routeLen - 1);
              if (newProgress === routeLen - 1 && !showSuccess[bus.id]) {
                setShowSuccess((s) => ({ ...s, [bus.id]: true }));
                setTimeout(() => {
                  setShowSuccess((s) => ({ ...s, [bus.id]: false }));
                  setTripDirection((d) => ({ ...d, [bus.id]: 'reverse' }));
                  setBusProgress((p) => ({ ...p, [bus.id]: routeLen - 1 }));
                }, 2000);
              }
            } else {
              newProgress = Math.max(newProgress - 1, 0);
              if (newProgress === 0 && !showSuccess[bus.id]) {
                setShowSuccess((s) => ({ ...s, [bus.id]: true }));
                setTimeout(() => {
                  setShowSuccess((s) => ({ ...s, [bus.id]: false }));
                  setTripDirection((d) => ({ ...d, [bus.id]: 'forward' }));
                  setBusProgress((p) => ({ ...p, [bus.id]: 0 }));
                }, 2000);
              }
            }
            next[bus.id] = newProgress;
          }
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [buses, tripDirection]);

  const handleSearchClick = () => {
    setShowSearchPanel(true);
  };

  const handleCloseSearch = () => {
    setShowSearchPanel(false);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const handleSearchBusSelect = (bus: BusData) => {
    handleBusCardPress(bus);
    setShowSearchPanel(false);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const handleFocusStop = (stopIndex: number) => {
    if (selectedBus && selectedBus.coordinates) {
      const coordinates = selectedBus.coordinates;
      const stopsCount = selectedBus.stops?.length || 1;
      // Calculate approximate coordinate index for this stop
      const coordIndex = Math.min(Math.floor((stopIndex / (stopsCount - 1)) * (coordinates.length - 1)), coordinates.length - 1);
      const stopCoord = coordinates[coordIndex];

      if (stopCoord && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: stopCoord.latitude,
          longitude: stopCoord.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, MAP_CONFIG.ANIMATION_DURATION);
      }
    }
  };

  const filteredBuses = filterBuses(buses, searchQuery);

  // [MapScreen] selectedBus: selectedBus
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }] }>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={{ marginTop: 16, color: '#334155' }}>Loading buses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }] }>
        <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Error loading buses</Text>
        <Text style={{ color: '#334155', marginTop: 8 }}>{error}</Text>
      </View>
    );
  }

  // Main map JSX (copied from previous return)
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Back Button */}
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1f2937" size={24} />
        </TouchableOpacity>
      )}
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={{
          ...userLocation,
          ...MAP_CONFIG.DEFAULT_ZOOM,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* User location circle */}
        <Circle
          center={userLocation}
          radius={MAP_CONFIG.USER_LOCATION_RADIUS}
          fillColor="rgba(59, 130, 246, 0.1)"
          strokeColor="rgba(59, 130, 246, 0.3)"
          strokeWidth={2}
        />


        {/* Bus markers and animated movement */}
        {buses.map((bus) => {
          const progress = busProgress[bus.id] || 0;
          const route = bus.coordinates || [];
          const markerCoord = route[progress] || route[0];
          if (showSuccess[bus.id]) return null;
          return (
            <BusMarker
              key={bus.id}
              bus={{ ...bus, latitude: markerCoord?.latitude, longitude: markerCoord?.longitude }}
              isSelected={selectedBus?.id === bus.id}
              onPress={handleBusMarkerPress}
            />
          );
        })}

        {/* Onboard users */}
        {onboardUsers.map((user) => (
          <React.Fragment key={user.id}>
            <Marker
              coordinate={{ latitude: user.latitude, longitude: user.longitude }}
              title={user.route + ' (Onboard)'}
              description={`From: ${user.startPoint}\nTo: ${user.destination}\nCrowd: ${user.crowd || ''}`}
              pinColor="#22c55e"
            >
              <View style={{ backgroundColor: '#22c55e', borderRadius: 16, padding: 4, borderWidth: 2, borderColor: '#fff' }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>🚌</Text>
              </View>
            </Marker>
            {user.coordinates && user.coordinates.length > 1 && (
              <Polyline
                coordinates={user.coordinates}
                strokeColor="#22c55e"
                strokeWidth={5}
                zIndex={20}
              />
            )}
          </React.Fragment>
        ))}

        {/* Highlight selected bus route */}
        {routeBus?.coordinates && (
          <>
            {/* Traveled portion - light black */}
            {busProgress[routeBus.id] > 0 && (
              <Polyline
                coordinates={routeBus.coordinates.slice(0, busProgress[routeBus.id] + 1)}
                strokeColor="#6b7280"
                strokeWidth={4}
                zIndex={9}
              />
            )}
            {/* Remaining portion - blue */}
            <Polyline
              coordinates={routeBus.coordinates.slice(busProgress[routeBus.id] || 0)}
              strokeColor="#38bdf8"
              strokeWidth={6}
              zIndex={10}
            />
          </>
        )}

        {/* Destination icon - show when panel is closed or when not showing success animation */}
        {routeBus?.coordinates && !showSuccess[routeBus?.id] && (
          <DestinationMarker coordinate={routeBus.coordinates[routeBus.coordinates.length - 1]} />
        )}

        {/* Success animation at destination */}
        {buses.map((bus) => (
          showSuccess[bus.id] && bus.coordinates && (
            <Marker
              key={bus.id + '-success'}
              coordinate={tripDirection[bus.id] === 'forward' ? bus.coordinates[bus.coordinates.length - 1] : bus.coordinates[0]}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <LottieView
                source={successAnim}
                autoPlay
                loop={false}
                style={{ width: 60, height: 60 }}
              />
            </Marker>
          )
        ))}
      </MapView>

      {/* Bus Details Popup */}
      {selectedBus && (
        <>
          <BusInfoPanel
            bus={selectedBus}
            progress={busProgress[selectedBus.id] || 0}
            onClose={closeBusDetails}
            onFocusStop={handleFocusStop}
          />
        </>
      )}

      {/* Nearby Buses Badge - Hidden when bus selected */}
      {!selectedBus && <NearbyBusesBadge count={buses.length} />}

      {/* Onboard Count */}
      {onboardUsers.length > 0 && (
        <View style={{ position: 'absolute', top: 120, right: 20, backgroundColor: '#22c55e', padding: 8, borderRadius: 16 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Onboard: {onboardUsers.length}</Text>
        </View>
      )}

      {/* Search Panel */}
      <SearchPanel
        visible={showSearchPanel}
        searchQuery={searchQuery}
        filteredBuses={filteredBuses}
        onQueryChange={setSearchQuery}
        onBusSelect={handleSearchBusSelect}
        onClose={handleCloseSearch}
      />

      {/* Map Controls - Hidden when bus selected */}
      {!selectedBus && (
        <MapControls
          onInfoClick={() => Alert.alert('Info', 'Community-powered transit tracking')}
          onSearchClick={handleSearchClick}
          onLocationClick={() => handleLocationClick(userLocation)}
          onNavigationClick={() => Alert.alert('Navigation', 'Start turn-by-turn navigation')}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}

