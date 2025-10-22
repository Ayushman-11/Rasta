import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface AvatarProps {
  name?: string;
  imageUri?: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
}

export const Avatar = ({
  name = 'User',
  imageUri,
  size = 'medium',
  backgroundColor = 'rgba(255, 255, 255, 0.25)',
}: AvatarProps) => {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const fontSizeMap = {
    small: 12,
    medium: 18,
    large: 24,
  };

  const avatarSize = sizeMap[size];

  if (imageUri) {
    return (
      <View
        style={[
          styles.glassContainer,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
        ]}
      >
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.glassContainer,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: fontSizeMap[size] }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: 'white',
    fontWeight: '700',
  },
});
