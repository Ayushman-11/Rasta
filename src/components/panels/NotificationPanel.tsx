import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { X, ChevronDown, ChevronUp, AlertCircle, Info, CheckCircle, Trash2 } from 'lucide-react-native';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;
const DELETE_THRESHOLD = width * 0.6;

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: string;
  expanded?: boolean;
}

interface NotificationPanelProps {
  visible: boolean;
  notifications: Notification[];
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const NotificationPanel = ({
  visible,
  notifications: initialNotifications,
  onClose,
  onDelete,
}: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [slideAnim] = useState(new Animated.Value(width));
  const [swipePositions, setSwipePositions] = useState<{ [key: string]: Animated.Value }>({});
  const [opacities, setOpacities] = useState<{ [key: string]: Animated.Value }>({});
  const [lockedPositions, setLockedPositions] = useState<{ [key: string]: number }>({});

  React.useEffect(() => {
    setNotifications(initialNotifications);
    // Initialize swipe positions and opacities for all notifications
    const positions: { [key: string]: Animated.Value } = {};
    const ops: { [key: string]: Animated.Value } = {};
    const locks: { [key: string]: number } = {};
    initialNotifications.forEach((notif) => {
      positions[notif.id] = new Animated.Value(0);
      ops[notif.id] = new Animated.Value(1);
      locks[notif.id] = 0; // Start at position 0
    });
    setSwipePositions(positions);
    setOpacities(ops);
    setLockedPositions(locks);
  }, [initialNotifications]);

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const toggleExpand = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, expanded: !notif.expanded } : notif
      )
    );
  };

  const handleDelete = (id: string) => {
    // Animate out smoothly with slide and fade
    const swipePos = swipePositions[id];
    const opacity = opacities[id];
    
    if (swipePos && opacity) {
      // Animate both slide and fade in parallel
      Animated.parallel([
        Animated.timing(swipePos, {
          toValue: width,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Then remove from list
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        onDelete?.(id);
        // Clean up the animation values and locked position
        const newPositions = { ...swipePositions };
        const newOpacities = { ...opacities };
        const newLocks = { ...lockedPositions };
        delete newPositions[id];
        delete newOpacities[id];
        delete newLocks[id];
        setSwipePositions(newPositions);
        setOpacities(newOpacities);
        setLockedPositions(newLocks);
      });
    }
  };

  const createPanResponder = (id: string) => {
    const swipePos = swipePositions[id];
    const opacity = opacities[id];
    
    // Return a no-op PanResponder if values aren't ready yet
    if (!swipePos || !opacity) {
      return PanResponder.create({
        onMoveShouldSetPanResponder: () => false,
      });
    }

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // More sensitive to horizontal swipes
        return Math.abs(gestureState.dx) > 3 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderGrant: () => {
        // Stop any ongoing animations when user starts swiping
        swipePos.stopAnimation();
        opacity.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        // Allow right swipe from current locked position
        const currentLocked = lockedPositions[id] || 0;
        const newPosition = currentLocked + gestureState.dx;
        if (newPosition >= currentLocked) {
          swipePos.setValue(newPosition);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentLocked = lockedPositions[id] || 0;
        const finalPosition = currentLocked + gestureState.dx;
        const velocity = gestureState.vx;
        
        // If currently at 0 and swiped past threshold
        if (currentLocked === 0 && finalPosition > SWIPE_THRESHOLD / 2) {
          // Lock at delete button width
          Animated.spring(swipePos, {
            toValue: SWIPE_THRESHOLD,
            useNativeDriver: true,
            tension: 120,
            friction: 10,
          }).start(() => {
            setLockedPositions(prev => ({ ...prev, [id]: SWIPE_THRESHOLD }));
          });
        }
        // If currently at delete button and swiped past delete threshold
        else if (currentLocked === SWIPE_THRESHOLD && (finalPosition > DELETE_THRESHOLD || velocity > 0.5)) {
          // Delete with animation
          handleDelete(id);
        }
        // Snap back to current locked position
        else {
          Animated.spring(swipePos, {
            toValue: currentLocked,
            useNativeDriver: true,
            tension: 120,
            friction: 10,
          }).start();
        }
      },
      onPanResponderTerminate: (_, gestureState) => {
        // If gesture is interrupted, snap back to locked position
        const currentLocked = lockedPositions[id] || 0;
        Animated.spring(swipePos, {
          toValue: currentLocked,
          useNativeDriver: true,
          tension: 120,
          friction: 10,
        }).start();
      },
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle color="#f59e0b" size={20} />;
      case 'success':
        return <CheckCircle color="#10b981" size={20} />;
      default:
        return <Info color="#3b82f6" size={20} />;
    }
  };

  const getBadgeVariant = (type: string): 'warning' | 'info' | 'success' => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  const resetSwipe = (id: string) => {
    const swipePos = swipePositions[id];
    if (swipePos) {
      Animated.spring(swipePos, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start(() => {
        setLockedPositions(prev => ({ ...prev, [id]: 0 }));
      });
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Panel */}
        <Animated.View
          style={[
            styles.panel,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#1f2937" size={24} />
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Info color="#9ca3af" size={48} />
                <Text style={styles.emptyTitle}>No notifications</Text>
                <Text style={styles.emptySubtitle}>
                  You're all caught up! Check back later for updates.
                </Text>
              </View>
            ) : (
              notifications.map((notification) => {
                const panResponder = createPanResponder(notification.id);
                const swipePos = swipePositions[notification.id] || new Animated.Value(0);
                const opacity = opacities[notification.id] || new Animated.Value(1);

                return (
                  <View key={notification.id} style={styles.notificationWrapper}>
                    {/* Delete Button (behind the card) */}
                    <View style={styles.deleteButtonContainer}>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(notification.id)}
                      >
                        <Trash2 color="white" size={24} />
                      </TouchableOpacity>
                    </View>

                    {/* Swipeable Card */}
                    <Animated.View
                      style={[
                        styles.swipeableCard,
                        {
                          transform: [{ translateX: swipePos }],
                          opacity: opacity,
                        },
                      ]}
                      {...panResponder.panHandlers}
                    >
                      <Card variant="outlined" style={styles.notificationCard}>
                        <TouchableOpacity
                          onPress={() => {
                            resetSwipe(notification.id);
                            toggleExpand(notification.id);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.notificationHeader}>
                            {getIcon(notification.type)}
                            <View style={styles.notificationContent}>
                              <Text style={styles.notificationTitle}>
                                {notification.title}
                              </Text>
                              <Text style={styles.notificationDate}>
                                {notification.date}
                              </Text>
                            </View>
                            <View style={styles.notificationActions}>
                              {notification.expanded ? (
                                <ChevronUp color="#6b7280" size={20} />
                              ) : (
                                <ChevronDown color="#6b7280" size={20} />
                              )}
                            </View>
                          </View>

                          {notification.expanded && (
                            <View style={styles.notificationBody}>
                              <Text style={styles.notificationMessage}>
                                {notification.message}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </Card>
                    </Animated.View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panel: {
    width: width,
    height: height,
    backgroundColor: '#f9fafb',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  notificationWrapper: {
    position: 'relative',
    marginBottom: 12,
    height: 'auto',
  },
  deleteButtonContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    width: 60,
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeableCard: {
    backgroundColor: 'transparent',
  },
  notificationCard: {
    marginBottom: 0,
    overflow: 'hidden',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  notificationDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  notificationActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  notificationBody: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginLeft: 32,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
