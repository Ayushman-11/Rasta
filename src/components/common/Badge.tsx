import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'small' | 'medium';
}

export const Badge = ({
  label,
  variant = 'primary',
  size = 'medium',
}: BadgeProps) => {
  const containerStyle: ViewStyle[] = [
    styles.badge,
    styles[`${variant}Badge`],
    styles[`${size}Badge`],
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
  ];

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  // Sizes
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mediumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  // Variants
  primaryBadge: {
    backgroundColor: '#dbeafe',
  },
  successBadge: {
    backgroundColor: '#d1fae5',
  },
  warningBadge: {
    backgroundColor: '#fef3c7',
  },
  errorBadge: {
    backgroundColor: '#fee2e2',
  },
  infoBadge: {
    backgroundColor: '#e0f2fe',
  },
  neutralBadge: {
    backgroundColor: '#f3f4f6',
  },
  // Text
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  primaryText: {
    color: '#1e40af',
  },
  successText: {
    color: '#065f46',
  },
  warningText: {
    color: '#92400e',
  },
  errorText: {
    color: '#991b1b',
  },
  infoText: {
    color: '#075985',
  },
  neutralText: {
    color: '#374151',
  },
});
