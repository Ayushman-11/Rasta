import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { MapPin, Navigation, Clock } from 'lucide-react-native';

interface RecentRouteCardProps {
  route: string;
  from: string;
  to: string;
  date: string;
  status: 'completed' | 'cancelled' | 'ongoing';
  duration: string;
  onPress: () => void;
}

export const RecentRouteCard = ({
  route,
  from,
  to,
  date,
  status,
  duration,
  onPress,
}: RecentRouteCardProps) => {
  const statusVariant = {
    completed: 'success' as const,
    cancelled: 'error' as const,
    ongoing: 'warning' as const,
  };

  return (
    <Card variant="elevated" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.routeContainer}>
          <Text style={styles.routeNumber}>{route}</Text>
          <Badge
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            variant={statusVariant[status]}
            size="small"
          />
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>

      <View style={styles.locations}>
        <View style={styles.locationRow}>
          <MapPin color="#14b8a6" size={16} />
          <Text style={styles.locationText} numberOfLines={1}>
            {from}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.locationRow}>
          <Navigation color="#6b7280" size={16} />
          <Text style={styles.locationText} numberOfLines={1}>
            {to}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.durationRow}>
          <Clock color="#9ca3af" size={14} />
          <Text style={styles.duration}>{duration}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#14b8a6',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  locations: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginLeft: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
    color: '#6b7280',
  },
});
