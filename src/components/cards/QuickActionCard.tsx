import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { LucideIcon } from 'lucide-react-native';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

export const QuickActionCard = ({
  icon: Icon,
  title,
  subtitle,
  color,
  onPress,
}: QuickActionCardProps) => {
  return (
    <Card variant="elevated" onPress={onPress} style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Icon color={color} size={28} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 160,
    minHeight: 120,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  content: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
});
