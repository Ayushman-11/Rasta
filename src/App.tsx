import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import { BottomNav } from './components/navigation/BottomNav';


import ShareMyBusScreen from './screens/ShareMyBusScreen';
import { BusData } from './types';
type Screen = 'home' | 'rewards' | 'grid' | 'offers' | 'support' | 'map' | 'sharebus';


function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [trackLiveBus, setTrackLiveBus] = useState<string | null>(null); // busNumber or id
  // Shared bus state (in-memory for now)
  const [sharedBus, setSharedBus] = useState<BusData | null>(null);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleTrackLive = (busNumber: string) => {
    setTrackLiveBus(busNumber);
    setCurrentScreen('map');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToMap={() => setCurrentScreen('map')}
            onNavigateToGrid={() => setCurrentScreen('grid')}
            onNavigateToRewards={() => setCurrentScreen('rewards')}
            onTrackLive={handleTrackLive}
          />
        );
      case 'map':
        return <MapScreen onBack={() => setCurrentScreen('home')} trackLiveBus={trackLiveBus} sharedBus={sharedBus} />;
      case 'sharebus':
        return <ShareMyBusScreen navigation={{ goBack: () => setCurrentScreen('home') }} onShare={setSharedBus} />;
      case 'rewards':
        return (
          <View style={styles.placeholder}>
            {/* Placeholder for Rewards Screen */}
          </View>
        );
      case 'grid':
        return (
          <View style={styles.placeholder}>
            {/* Placeholder for Grid View Screen */}
          </View>
        );
      case 'offers':
        return (
          <View style={styles.placeholder}>
            {/* Placeholder for Offers Screen */}
          </View>
        );
      case 'support':
        return (
          <View style={styles.placeholder}>
            {/* Placeholder for Support Screen */}
          </View>
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" />
      {renderScreen()}
      {currentScreen !== 'map' && (
        <BottomNav activeScreen={currentScreen} onNavigate={handleNavigate} />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
}); 

export default App;

