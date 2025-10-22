import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NearbyBusesBadgeProps {
  count: number;
}

export const NearbyBusesBadge = ({ count }: NearbyBusesBadgeProps) => {
  return (
    <View style={styles.nearbyBusesBadge}>
      <Text style={styles.nearbyBusesIcon}>🚌</Text>
      <Text style={styles.nearbyBusesLabel}>NEARBY</Text>
      <Text style={styles.nearbyBusesValue}>{count} BUSES</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  nearbyBusesBadge: {
    position: 'absolute',
    bottom: 140,
    left: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#14b8a6',
  },
  nearbyBusesIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  nearbyBusesLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  nearbyBusesValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14b8a6',
  },
});
