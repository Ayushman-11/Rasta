import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen } from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import { BottomNav } from './components/navigation/BottomNav';


import ShareMyBusScreen from './screens/ShareMyBusScreen';
import { BusData } from './types';
type Screen = 'home' | 'rewards' | 'grid' | 'offers' | 'support' | 'map' | 'sharebus';


function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [trackLiveBus, setTrackLiveBus] = useState<string | null>(null);
  const [onboardUsers, setOnboardUsers] = useState<BusData[]>([]);

  // Load onboard users
  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('onboardUsers');
      if (stored) setOnboardUsers(JSON.parse(stored));
    };
    load();
  }, []);

  // Save onboard users
  useEffect(() => {
    AsyncStorage.setItem('onboardUsers', JSON.stringify(onboardUsers));
  }, [onboardUsers]);

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
        return <MapScreen onBack={() => setCurrentScreen('home')} trackLiveBus={trackLiveBus} onboardUsers={onboardUsers} />;
      case 'sharebus':
        return <ShareMyBusScreen navigation={{ goBack: () => setCurrentScreen('home') }} onShare={(bus) => setOnboardUsers(prev => [...prev, bus])} />;
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

