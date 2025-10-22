import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, MapPin, Navigation, Bus } from 'lucide-react-native';
import { theme } from '../../constants/theme';

interface BusCardProps {
  busNumber: string;
  estimatedTime: string;
  crowdLevel: 'Low crowd' | 'Medium crowd' | 'High crowd';
  stops: string[];
  onSetAlert?: () => void;
  onTrackLive?: () => void;
}

export const BusCard = ({
  busNumber,
  estimatedTime,
  crowdLevel,
  stops,
  onSetAlert,
  onTrackLive,
}: BusCardProps) => {
  const getCrowdColor = () => {
    switch (crowdLevel) {
      case 'Low crowd':
        return theme.colors.success;
      case 'Medium crowd':
        return theme.colors.accent;
      case 'High crowd':
        return theme.colors.error;
      default:
        return theme.colors.text.tertiary;
    }
  };

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.header}>
        {/* Bus Icon & Info */}
        <View style={styles.busInfo}>
          <View style={styles.busIconContainer}>
            <Bus color="white" size={24} />
          </View>
          <View style={styles.busDetails}>
            <Text style={styles.busNumber}>{busNumber}</Text>
            <View style={styles.statusRow}>
              <Text style={styles.estimatedTime}>{estimatedTime}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={[styles.crowdLevel, { color: getCrowdColor() }]}>
                {crowdLevel}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Icons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.badge}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Bell color={theme.colors.accent} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stops Row */}
      <View style={styles.stopsContainer}>
        <MapPin color={theme.colors.text.tertiary} size={16} />
        <Text style={styles.stopsText} numberOfLines={1}>
          Stops • {stops.join(' • ')}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={onSetAlert}
        >
          <Bell color={theme.colors.primary} size={18} />
          <Text style={styles.secondaryButtonText}>Set Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={onTrackLive}
        >
          <Navigation color="white" size={18} />
          <Text style={styles.primaryButtonText}>Track Live</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.md,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  busIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busDetails: {
    flex: 1,
    gap: 4,
  },
  busNumber: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  estimatedTime: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },
  dot: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
  },
  crowdLevel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary,
  },
  stopsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  stopsText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: 'white',
  },
  secondaryButtonText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.primary,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  primaryButtonText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: 'white',
  },
});
