import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { BusData } from '../../types';

interface BusDetailsCardProps {
  bus: BusData;
  busIndex: number;
  totalBuses: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  panHandlers: any;
}

export const BusDetailsCard = ({
  bus,
  busIndex,
  totalBuses,
  onPrevious,
  onNext,
  onClose,
  panHandlers,
}: BusDetailsCardProps) => {
  return (
    <View style={styles.busDetailsPopup} {...panHandlers}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X color="#9ca3af" size={20} />
      </TouchableOpacity>

      {/* Navigation Arrows - Infinite Loop */}
      <View style={styles.busNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={onPrevious}>
          <ChevronLeft color="#14b8a6" size={24} />
        </TouchableOpacity>

        <View style={styles.busMainInfo}>
          <Text style={styles.busRouteNumber}>{bus.route}</Text>
          <Text style={styles.busDestination}>{bus.destination}</Text>
        </View>

        <TouchableOpacity style={styles.navButton} onPress={onNext}>
          <ChevronRight color="#14b8a6" size={24} />
        </TouchableOpacity>
      </View>

      {/* Quick Info */}
      <View style={styles.busQuickInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>ETA</Text>
          <Text style={styles.infoValue}>{bus.estimatedTime}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Passengers</Text>
          <Text style={styles.infoValue}>{bus.passengers}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{bus.currentLocation}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  busDetailsPopup: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  busNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busMainInfo: {
    flex: 1,
    alignItems: 'center',
  },
  busRouteNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14b8a6',
    marginBottom: 2,
  },
  busDestination: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  busQuickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  infoDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#e5e7eb',
  },
});
