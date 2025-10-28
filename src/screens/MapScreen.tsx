import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { View, StyleSheet, Dimensions, Alert, Platform, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Polyline, Marker, Region } from 'react-native-maps';
import MapViewCluster from 'react-native-map-clustering'; // Ensure clustering library is imported
import { StatusBar } from 'expo-status-bar';
import { Keyboard } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Svg, Circle as SvgCircle } from 'react-native-svg';
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
  sharedBus?: BusData | null;
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

export default function MapScreen({ onBack, trackLiveBus, sharedBus }: MapScreenProps) {
  const { location: userLocation } = useLocation();
  const [buses, setBuses] = useState<BusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Animation state
  const [busProgress, setBusProgress] = useState<{ [busId: string]: number }>({});
  const [showSuccess, setShowSuccess] = useState<{ [busId: string]: boolean }>({});
  // Remove tripDirection state, only allow forward movement
  // Route display state - persists even when panel is closed
  const [routeBus, setRouteBus] = useState<BusData | null>(null);
  const [zoomLevel, setZoomLevel] = useState(15); // Default zoom level

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
          let newProgress = prev[bus.id] || 0;
          if (routeLen > 1) {
            newProgress = Math.min(newProgress + 1, routeLen - 1);
            if (newProgress === routeLen - 1 && !showSuccess[bus.id]) {
              setShowSuccess((s) => ({ ...s, [bus.id]: true }));
              setTimeout(() => {
                setShowSuccess((s) => ({ ...s, [bus.id]: false }));
                setBusProgress((p) => {
                  const updatedProgress = { ...p };
                  delete updatedProgress[bus.id]; // Remove bus progress
                  return updatedProgress;
                });

                // Restart the bus journey with reversed stops and updated ETA
                setBuses((prevBuses) => {
                  return prevBuses.map((b) => {
                    if (b.id === bus.id) {
                      const reversedCoordinates = [...(b.coordinates || [])].reverse();
                      const reversedStops = [...(b.stops || [])].reverse();
                      return {
                        ...b,
                        coordinates: reversedCoordinates,
                        stops: reversedStops,
                        estimatedTime: `${parseInt(b.estimatedTime) + 10} mins`, // Add 10 minutes to estimated time
                      };
                    }
                    return b;
                  });
                });
              }, 5000); // Restart after 5 seconds
            }
            next[bus.id] = newProgress;
          }
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [buses]);

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

  const handleRegionChangeComplete = (region: Region) => {
    const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2); // Calculate zoom level
    setZoomLevel(zoom);
  };

  const calculateMarkerSize = (zoom: number) => {
    return Math.max(20, Math.min(60, zoom * 4)); // Adjust size based on zoom
  };

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
      <MapViewCluster
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={{
          ...userLocation,
          ...MAP_CONFIG.DEFAULT_ZOOM,
        }}
        onRegionChangeComplete={handleRegionChangeComplete} // Track region changes
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


        {/* Bus markers with clustering */}
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
              size={calculateMarkerSize(zoomLevel)} // Pass dynamic size
            />
          );
        })}

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

        {/* Start and destination markers - only for focused bus */}
        {routeBus?.coordinates && (
          <>
            {/* Start marker */}
            <Marker
              coordinate={routeBus.coordinates[0]}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <Svg width={32} height={32} viewBox="0 0 32 32">
                <SvgCircle cx={16} cy={16} r={12} stroke="#38bdf8" strokeWidth={3} fill="white" />
                <SvgCircle cx={16} cy={16} r={6} stroke="#38bdf8" strokeWidth={3} fill="white" />
              </Svg>
            </Marker>

            {/* Destination marker */}
            <DestinationMarker coordinate={routeBus.coordinates[routeBus.coordinates.length - 1]} />
          </>
        )}

        {/* Success animation at destination */}
        {buses.map((bus) => (
          showSuccess[bus.id] && bus.coordinates && (
            <Marker
              key={bus.id + '-success'}
              coordinate={bus.coordinates[bus.coordinates.length - 1]}
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
      </MapViewCluster>

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

