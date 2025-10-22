import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Gift, Share2, Coffee, Headphones } from 'lucide-react-native';
import { theme } from '../../constants/theme';

interface BottomNavProps {
  activeScreen?: 'home' | 'rewards' | 'sharebus' | 'offers' | 'support' | 'grid';
  onNavigate?: (screen: 'home' | 'rewards' | 'sharebus' | 'offers' | 'support' | 'grid') => void;
}

export function BottomNav({ activeScreen = 'home', onNavigate }: BottomNavProps) {
  const getIconColor = (screen: string) => {
    return activeScreen === screen ? theme.colors.primary : theme.colors.text.secondary;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.navbar, { backgroundColor: theme.colors.background.secondary, shadowColor: theme.colors.primary }] }>
        <TouchableOpacity
          style={styles.button}
          accessibilityLabel="Home"
          onPress={() => onNavigate?.('home')}
        >
          <Home color={getIconColor('home')} size={24} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          accessibilityLabel="Rewards"
          onPress={() => onNavigate?.('rewards')}
        >
          <Gift color={getIconColor('rewards')} size={24} />
        </TouchableOpacity>
        
        {/* Main action button: Share My Bus */}
        <View style={styles.mainButtonContainer}>
          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
            accessibilityLabel="Share My Bus"
            onPress={() => onNavigate?.('sharebus')}
          >
            <Share2 color={theme.colors.text.inverse} size={28} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          accessibilityLabel="Offers"
          onPress={() => onNavigate?.('offers')}
        >
          <Coffee color={getIconColor('offers')} size={24} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          accessibilityLabel="Support"
          onPress={() => onNavigate?.('support')}
        >
          <Headphones color={getIconColor('support')} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  navbar: {
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    padding: 8,
    borderRadius: 20,
  },
  mainButtonContainer: {
    marginTop: -32,
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
