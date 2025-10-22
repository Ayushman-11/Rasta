import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Info, Search, Navigation, Crosshair } from 'lucide-react-native';

interface MapControlsProps {
  onInfoClick?: () => void;
  onSearchClick?: () => void;
  onLocationClick?: () => void;
  onNavigationClick?: () => void;
}

export function MapControls({
  onInfoClick,
  onSearchClick,
  onLocationClick,
  onNavigationClick,
}: MapControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onInfoClick}
        style={styles.button}
        accessibilityLabel="Info"
      >
        <Info color="#374151" size={20} />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={onSearchClick}
        style={styles.button}
        accessibilityLabel="Search"
      >
        <Search color="#374151" size={20} />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={onLocationClick}
        style={styles.button}
        accessibilityLabel="Center on location"
      >
        <Crosshair color="#374151" size={20} />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={onNavigationClick}
        style={styles.button}
        accessibilityLabel="Navigation"
      >
        <Navigation color="#374151" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 140,
    gap: 12,
    zIndex: 10,
  },
  button: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
});
