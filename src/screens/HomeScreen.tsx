import React, { useState, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../components/common/Avatar';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/cards/StatCard';
import { RecentRouteCard } from '../components/cards/RecentRouteCard';
import { NotificationPanel } from '../components/panels/NotificationPanel';
import { BusCard } from '../components/cards/BusCard';
import { useEffect } from 'react';
import { generateMockBuses } from '../utils/busGenerator';
import {
  Route,
  Search,
  Bell,
  ChevronRight,
  MapPin,
} from 'lucide-react-native';
import {
  MOCK_USER,
  MOCK_STATS,
  MOCK_RECENT_TRIPS,
  MOCK_NOTIFICATIONS,
} from '../constants/mockData';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');


export interface HomeScreenProps {
  onNavigateToMap?: () => void;
  onNavigateToGrid?: () => void;
  onNavigateToRewards?: () => void;
  onTrackLive?: (busNumber: string) => void;
}

export function HomeScreen(props: HomeScreenProps) {
  const { onNavigateToMap, onNavigateToGrid, onNavigateToRewards, onTrackLive } = props;
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [liveBuses, setLiveBuses] = useState([]);

  useEffect(() => {
    (async () => {
      const buses = await generateMockBuses();
      setLiveBuses(buses.slice(0, 2));
    })();
  }, []);

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Animation and haptic feedback for left swipe
  const panRef = useRef(null);
  const [swipeAnim] = useState(new Animated.Value(1));
  const handleGestureEvent = (event: any) => {
    if (event.nativeEvent.translationX < -50 && event.nativeEvent.state === State.ACTIVE) {
      // Smooth fade out and in
      Animated.sequence([
        Animated.timing(swipeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(swipeAnim, { toValue: 1, duration: 220, useNativeDriver: true })
      ]).start();
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (event.nativeEvent.translationX < -50 && event.nativeEvent.state === State.END) {
      if (onNavigateToMap) onNavigateToMap();
    }
  };

  return (
    <PanGestureHandler
      ref={panRef}
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleGestureEvent}
      activeOffsetX={-20}
    >
      <Animated.View style={[styles.container, { opacity: swipeAnim }]}> 
  <StatusBar style="light" />
      
  {/* Enhanced Header with Pattern Background */}
      <View style={styles.headerContainer}>
        {/* Pattern Background Image */}
        <ImageBackground
          source={require('../assets/illustrations/pattern.png')}
          style={styles.patternBackground}
          resizeMode="repeat"
          imageStyle={{ opacity: 0.4 }}
        />
        
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.headerLeft}>
            <Avatar name={MOCK_USER.name} size="medium" />
          </View>
          
          <View style={styles.headerCenter}>
            <View style={styles.locationContainer}>
              <MapPin color="rgba(255, 255, 255, 0.9)" size={14} />
              <Text style={styles.locationText} numberOfLines={1}>
                JP Nagar Metro Station
              </Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <Card 
              variant="flat" 
              padding={12} 
              onPress={() => setShowNotifications(true)}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Bell color="white" size={20} />
              {notifications.length > 0 && !showNotifications && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{notifications.length}</Text>
                </View>
              )}
            </Card>
          </View>
        </View>

        {/* Find a Bus Card */}
        <View style={styles.searchSection}>
          <TouchableOpacity 
            style={styles.findBusCard}
            onPress={onNavigateToMap || (() => {})}
            activeOpacity={0.9}
          >
            <View style={styles.findBusContent}>
              <Text style={styles.findBusTitle}>Find a Bus</Text>
              <Text style={styles.findBusDescription}>
                Search routes & track in real-time
              </Text>
            </View>
            <View style={styles.findBusIcon}>
              <Route color={theme.colors.primary} size={32} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Live Buses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Buses</Text>
            <TouchableOpacity onPress={onNavigateToMap}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {liveBuses.map((bus) => (
            <BusCard
              key={bus.id}
              busNumber={bus.route}
              estimatedTime={bus.estimatedTime || 'Live'}
              crowdLevel={bus.passengers <= 5 ? 'Low crowd' : bus.passengers <= 15 ? 'Medium crowd' : 'High crowd'}
              stops={bus.stops}
              onSetAlert={() => {}}
              onTrackLive={() => onTrackLive && onTrackLive(bus.route)}
            />
          ))}
        </View>

        {/* Recent Trips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>
          {MOCK_RECENT_TRIPS.map((trip) => (
            <RecentRouteCard
              key={trip.id}
              route={trip.route}
              from={trip.from}
              to={trip.to}
              date={trip.date}
              status={trip.status}
              duration={trip.duration}
              onPress={() => {}}
            />
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Notification Panel */}
      <NotificationPanel
        visible={showNotifications}
        notifications={notifications}
        onClose={() => setShowNotifications(false)}
        onDelete={handleDeleteNotification}
      />
    </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  headerContainer: {
    position: 'relative',
    backgroundColor: theme.colors.primary,
    paddingBottom: 20,
    borderBottomLeftRadius: theme.borderRadius['2xl'],
    borderBottomRightRadius: theme.borderRadius['2xl'],
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  patternBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerLeft: {
    width: 50,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerRight: {
    width: 50,
    alignItems: 'flex-end',
    position: 'relative',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  locationText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    maxWidth: 180,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  findBusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  findBusContent: {
    flex: 1,
    gap: 4,
  },
  findBusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  findBusDescription: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '400',
  },
  findBusIcon: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  statsScrollContainer: {
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    gap: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}20`,
    borderBottomWidth: 3,
    borderBottomColor: `${theme.colors.primary}50`,
    position: 'relative',
    overflow: 'hidden',
  },
  statCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#14b8a6',
    fontWeight: '600',
  },
  statsContainer: {
    gap: 12,
    paddingRight: 20,
  },
  heroCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#14b8a6',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    gap: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  heroArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});
