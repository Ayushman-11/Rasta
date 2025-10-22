import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { X, Bus, MapPin, Navigation } from 'lucide-react-native';
import { BusData } from '../../types';

interface SearchPanelProps {
  visible: boolean;
  searchQuery: string;
  filteredBuses: BusData[];
  onQueryChange: (query: string) => void;
  onBusSelect: (bus: BusData) => void;
  onClose: () => void;
}

export const SearchPanel = ({
  visible,
  searchQuery,
  filteredBuses,
  onQueryChange,
  onBusSelect,
  onClose,
}: SearchPanelProps) => {
  if (!visible) return null;

  return (
    <View style={styles.searchPanel}>
      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search destination, location, or route..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={onQueryChange}
          autoFocus
          returnKeyType="search"
        />
        <TouchableOpacity onPress={onClose} style={styles.closeSearchButton}>
          <X color="#6b7280" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.searchResults}>
        {filteredBuses.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No buses found</Text>
            <Text style={styles.noResultsSubtext}>Try a different search term</Text>
          </View>
        ) : (
          filteredBuses.map((bus: BusData) => (
            <TouchableOpacity
              key={bus.id}
              style={styles.busCard}
              onPress={() => onBusSelect(bus)}
            >
              <View style={styles.busCardHeader}>
                <View style={styles.busCardIcon}>
                  <Bus color="white" size={20} />
                  <Text style={styles.busCardRoute}>{bus.route}</Text>
                </View>
                <View style={styles.busCardInfo}>
                  <Text style={styles.busCardTitle}>Route {bus.route}</Text>
                  <Text style={styles.busCardPassengers}>{bus.passengers} passengers</Text>
                </View>
              </View>

              <View style={styles.busCardLocation}>
                <View style={styles.locationRow}>
                  <MapPin color="#10b981" size={16} />
                  <View style={styles.locationText}>
                    <Text style={styles.locationLabel}>From</Text>
                    <Text style={styles.locationValue}>{bus.startPoint}</Text>
                  </View>
                </View>

                <View style={styles.locationRow}>
                  <Navigation color="#ef4444" size={16} />
                  <View style={styles.locationText}>
                    <Text style={styles.locationLabel}>To</Text>
                    <Text style={styles.locationValue}>{bus.destination}</Text>
                  </View>
                </View>

                <View style={styles.locationRow}>
                  <MapPin color="#14b8a6" size={16} />
                  <View style={styles.locationText}>
                    <Text style={styles.locationLabel}>Currently at</Text>
                    <Text style={styles.locationValue}>{bus.currentLocation}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.busCardFooter}>
                <Text style={styles.busCardTime}>Arrives in {bus.estimatedTime}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 30,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  closeSearchButton: {
    marginLeft: 12,
    padding: 8,
  },
  searchResults: {
    flex: 1,
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  busCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  busCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  busCardIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  busCardRoute: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  busCardInfo: {
    flex: 1,
  },
  busCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  busCardPassengers: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  busCardLocation: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  busCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  busCardTime: {
    fontSize: 14,
    color: '#14b8a6',
    fontWeight: '600',
  },
});
