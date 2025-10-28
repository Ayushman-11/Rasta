import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal, Animated, PanResponder, Dimensions, Alert } from 'react-native';
import { X, Share2, ChevronUp, ChevronDown, MapPin, Clock } from 'lucide-react-native';
import { BusData } from '../../types';



type BusInfoPanelProps = {
  bus: BusData;
  progress: number;
  onClose: () => void;
  onFocusStop?: (stopIndex: number) => void;
};

export const BusInfoPanel = ({ bus, progress, onClose, onFocusStop }: BusInfoPanelProps) => {
  const stops = bus.stops || [];
  const times = bus.stopTimes || [];
  const coordinates = bus.coordinates || [];

  // Calculate current stop based on progress through route
  const totalCoordinates = coordinates.length;
  const stopsCount = stops.length;
  const progressRatio = totalCoordinates > 0 ? progress / (totalCoordinates - 1) : 0;
  const currentStopIdx = Math.min(Math.floor(progressRatio * stopsCount), stopsCount - 1);
  const nextStopIdx = Math.min(currentStopIdx + 1, stopsCount - 1);

  // Calculate distance to next stop (simplified)
  const stopsToNext = nextStopIdx - currentStopIdx;
  const distanceToNext = stopsToNext > 0 ? `${stopsToNext} stop${stopsToNext > 1 ? 's' : ''} away` : 'Arriving now';

  // Dummy values for travel time and arrival, replace with real data if available
  const arrivalTime = bus.estimatedArrival || '12:45 PM';
  const travelTime = bus.travelTime || '50 minutes';
  const eta = bus.estimatedTime || '10 min';

  const { height: screenHeight } = Dimensions.get('window');
  const collapsedHeight = 220; // Height when collapsed
  const expandedHeight = screenHeight * 0.75; // Height when expanded

  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(collapsedHeight)).current;
  const currentHeightRef = useRef(collapsedHeight);

  // Update ref when animation changes
  animatedHeight.addListener(({ value }) => {
    currentHeightRef.current = value;
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newHeight = collapsedHeight - gestureState.dy;
        if (newHeight >= collapsedHeight && newHeight <= expandedHeight) {
          animatedHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const threshold = 50;
        if (gestureState.dy < -threshold) {
          setIsExpanded(true);
          Animated.spring(animatedHeight, {
            toValue: expandedHeight,
            useNativeDriver: false,
          }).start();
        } else if (gestureState.dy > threshold) {
          setIsExpanded(false);
          Animated.spring(animatedHeight, {
            toValue: collapsedHeight,
            useNativeDriver: false,
          }).start();
        } else {
          const currentHeight = currentHeightRef.current;
          const midPoint = (collapsedHeight + expandedHeight) / 2;
          const targetHeight = currentHeight > midPoint ? expandedHeight : collapsedHeight;
          setIsExpanded(targetHeight === expandedHeight);
          Animated.spring(animatedHeight, {
            toValue: targetHeight,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const toggleExpanded = () => {
    const targetHeight = isExpanded ? collapsedHeight : expandedHeight;
    setIsExpanded(!isExpanded);
    Animated.spring(animatedHeight, {
      toValue: targetHeight,
      useNativeDriver: false,
    }).start();
  };

  const handleStopPress = (stopIndex: number) => {
    if (onFocusStop) {
      onFocusStop(stopIndex);
    } else {
      Alert.alert('Stop Selected', `Focus on: ${stops[stopIndex]}`);
    }
  };

  const handleSharePress = () => {
    Alert.alert('Share Ride', `Share bus ${bus.route} from ${bus.startPoint} to ${bus.destination}`);
  };

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'box-none' }}>
      <View style={{ flex: 1, justifyContent: 'flex-end', pointerEvents: 'box-none' }}>
        {/* Semi-transparent overlay that doesn't block touches */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          pointerEvents: 'none'
        }} />

        {/* Panel container that captures touches */}
        <View style={{ pointerEvents: 'auto' }}>
          <Animated.View style={[styles.panel, { height: animatedHeight }]}>
            {/* Drag Handle */}
            <View style={styles.dragHandle} {...panResponder.panHandlers}>
              <TouchableOpacity onPress={toggleExpanded} style={styles.dragIndicator}>
                {isExpanded ? <ChevronDown size={20} color="#9ca3af" /> : <ChevronUp size={20} color="#9ca3af" />}
              </TouchableOpacity>
            </View>

            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#9ca3af" size={20} />
            </TouchableOpacity>

            {/* Header Content - Always visible */}
            <View style={styles.headerContent}>
              <View style={styles.arrivalRow}>
                <View style={styles.arrivalInfo}>
                  <Text style={styles.arrivalText}>Arriving at <Text style={styles.arrivalTime}>{arrivalTime}</Text></Text>
                  <Text style={styles.distanceText}>{distanceToNext}</Text>
                </View>
                <Pressable style={styles.shareButton} onPress={handleSharePress}>
                  <Share2 color="#334155" size={18} />
                  <Text style={styles.shareText}>Share</Text>
                </Pressable>
              </View>

              <View style={styles.busRouteRow}>
                <View style={styles.busDot} />
                <View style={styles.busRouteInfo}>
                  <Text style={styles.busRouteText}>Bus {bus.route}</Text>
                  <Text style={styles.busRouteSubtext}>{bus.startPoint} → {bus.destination}</Text>
                </View>
              </View>
            </View>

            {/* Expanded Content */}
            {isExpanded && (
              <ScrollView style={styles.expandedContent} showsVerticalScrollIndicator={false}>
                {/* Progress indicator */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Route Progress</Text>
                    <Text style={styles.progressPercent}>{Math.round(progressRatio * 100)}% complete</Text>
                  </View>
                  <View style={styles.progressRow}>
                    <Text style={styles.etaBox}>{eta}</Text>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <View style={styles.sliderTrack}>
                        <View style={[styles.sliderFill, { width: `${progressRatio * 100}%` }]} />
                      </View>
                    </View>
                    <Text style={styles.travelTimeBox}>{travelTime}</Text>
                  </View>
                </View>

                {/* Interactive Timeline */}
                <View style={styles.timelineSection}>
                  <Text style={styles.timelineTitle}>Stops</Text>
                  {stops.map((stop, idx) => {
                    const isCurrentStop = idx === currentStopIdx;
                    const isNextStop = idx === nextStopIdx;
                    const isPastStop = idx < currentStopIdx;
                    const isFutureStop = idx > currentStopIdx;

                    return (
                      <TouchableOpacity
                        key={stop}
                        style={styles.timelineRow}
                        onPress={() => handleStopPress(idx)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.timelineLeft}>
                          <View style={[
                            styles.timelineDot,
                            isCurrentStop && styles.timelineDotCurrent,
                            isNextStop && styles.timelineDotNext,
                            isPastStop && styles.timelineDotPast
                          ]} />
                          {idx < stops.length - 1 && (
                            <View style={[
                              styles.timelineLine,
                              isPastStop && styles.timelineLinePast
                            ]} />
                          )}
                        </View>
                        <View style={styles.timelineContent}>
                          <View style={styles.stopHeader}>
                            <Text style={[
                              styles.timelineStop,
                              isCurrentStop && styles.timelineStopCurrent,
                              isNextStop && styles.timelineStopNext,
                              isPastStop && styles.timelineStopPast
                            ]}>
                              {stop}
                            </Text>
                            {isCurrentStop && <Text style={styles.liveBadge}>LIVE</Text>}
                            {isNextStop && <Text style={styles.nextBadge}>NEXT</Text>}
                          </View>
                          <View style={styles.stopDetails}>
                            <Clock size={12} color="#64748b" />
                            <Text style={[
                              styles.timelineTime,
                              isCurrentStop && styles.timelineTimeCurrent,
                              isNextStop && styles.timelineTimeNext
                            ]}>
                              {times[idx] || '--:--'}
                            </Text>
                            {isNextStop && (
                              <Text style={styles.distanceToStop}>
                                {stopsToNext === 1 ? 'Next stop' : `${stopsToNext} stops away`}
                              </Text>
                            )}
                          </View>
                        </View>
                        <TouchableOpacity style={styles.focusButton}>
                          <MapPin size={16} color="#9ca3af" />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  arrivalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 8,
  },
  arrivalText: {
    fontSize: 15,
    color: '#64748b',
  },
  arrivalTime: {
    color: '#14b8a6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  shareText: {
    marginLeft: 4,
    color: '#334155',
    fontWeight: '600',
    fontSize: 13,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  etaBox: {
    backgroundColor: '#e0fce2',
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  sliderTrack: {
    width: '90%',
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  sliderFill: {
    height: 6,
    backgroundColor: '#14b8a6',
    borderRadius: 3,
  },
  travelTimeBox: {
    backgroundColor: '#f3f4f6',
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  busRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  busDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fbbf24',
    marginRight: 8,
  },
  busRouteText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  timeline: {
    marginTop: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    marginBottom: 2,
  },
  timelineDotActive: {
    backgroundColor: '#14b8a6',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  timelineLine: {
    width: 2,
    height: 32,
    backgroundColor: '#e5e7eb',
    marginTop: 0,
    marginBottom: 0,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 4,
  },
  timelineStop: {
    fontSize: 15,
    color: '#334155',
  },
  timelineStopActive: {
    color: '#14b8a6',
    fontWeight: '700',
  },
  timelineTime: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  timelineTimeActive: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  dragHandle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dragIndicator: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginTop: 8,
  },
  headerContent: {
    paddingTop: 50, // Space for drag handle
    paddingHorizontal: 20,
  },
  expandedContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  arrivalInfo: {
    flex: 1,
  },
  distanceText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  busRouteInfo: {
    flex: 1,
  },
  busRouteSubtext: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  progressPercent: {
    fontSize: 14,
    color: '#64748b',
  },
  timelineSection: {
    marginTop: 10,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  timelineDotCurrent: {
    backgroundColor: '#14b8a6',
    borderWidth: 3,
    borderColor: '#22c55e',
  },
  timelineDotNext: {
    backgroundColor: '#fbbf24',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  timelineDotPast: {
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#059669',
  },
  timelineLinePast: {
    backgroundColor: '#10b981',
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timelineStopCurrent: {
    color: '#14b8a6',
    fontWeight: '700',
  },
  timelineStopNext: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  timelineStopPast: {
    color: '#10b981',
    fontWeight: '500',
  },
  liveBadge: {
    backgroundColor: '#dc2626',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  nextBadge: {
    backgroundColor: '#f59e0b',
    color: '#92400e',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  stopDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineTimeCurrent: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  timelineTimeNext: {
    color: '#d97706',
    fontWeight: '600',
  },
  distanceToStop: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 8,
  },
  focusButton: {
    padding: 8,
    marginLeft: 8,
  },
});
