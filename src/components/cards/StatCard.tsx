import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string | number;
  subtitle?: string;
}

export const StatCard = ({ icon: Icon, iconColor, label, value, subtitle }: StatCardProps) => {
  return (
    <Card variant="elevated" style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Icon color={iconColor} size={24} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  content: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 11,
    color: '#9ca3af',
  },
});
