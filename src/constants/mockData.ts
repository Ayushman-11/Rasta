// Mock data for development

// Kolhapur-specific locations and routes
export const KOLHAPUR_LOCATIONS = [
  { name: 'Rankala Lake', latitude: 16.6956, longitude: 74.2075 },
  { name: 'ST Stand', latitude: 16.7032, longitude: 74.2186 },
  { name: 'D.Y. College', latitude: 16.7081, longitude: 74.2215 },
  { name: 'Railway Station', latitude: 16.7002, longitude: 74.2331 },
  { name: 'Market Yard', latitude: 16.7048, longitude: 74.2152 },
  { name: 'Mahalaxmi Temple', latitude: 16.6946, longitude: 74.2181 },
  { name: 'Shivaji University', latitude: 16.7087, longitude: 74.2433 },
  { name: 'New Palace', latitude: 16.6950, longitude: 74.2087 },
  { name: 'Town Hall', latitude: 16.7011, longitude: 74.2167 },
  { name: 'Tarabai Park', latitude: 16.7102, longitude: 74.2255 },
];

export const KOLHAPUR_ROUTES = [
  {
    id: '27',
    name: 'Bus 27',
    stops: ['Rankala Lake', 'Shivaji University', 'ST Stand', 'D.Y. College'],
    coordinates: [
      { latitude: 16.6956, longitude: 74.2075 }, // Rankala Lake
      { latitude: 16.6972, longitude: 74.2105 }, // Road segment
      { latitude: 16.6995, longitude: 74.2150 }, // Road segment
      { latitude: 16.7040, longitude: 74.2180 }, // Shivaji University
      { latitude: 16.7032, longitude: 74.2186 }, // ST Stand
      { latitude: 16.7060, longitude: 74.2200 }, // Road segment
      { latitude: 16.7081, longitude: 74.2215 }, // D.Y. College
    ],
  },
  {
    id: '15',
    name: 'Bus 15',
    stops: ['Railway Station', 'Market Yard', 'New Palace', 'Hospital'],
    coordinates: [
      { latitude: 16.7002, longitude: 74.2331 }, // Railway Station
      { latitude: 16.7020, longitude: 74.2280 }, // Road segment
      { latitude: 16.7048, longitude: 74.2152 }, // Market Yard
      { latitude: 16.6950, longitude: 74.2087 }, // New Palace
      { latitude: 16.7032, longitude: 74.2186 }, // Hospital (using ST Stand as hospital for demo)
    ],
  },
];

export const DEFAULT_LOCATION = {
  latitude: 51.5074,
  longitude: -0.1278,
};

export const MAP_CONFIG = {
  DEFAULT_ZOOM: {
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  },
  FOCUSED_ZOOM: {
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  },
  ANIMATION_DURATION: 400,
  USER_LOCATION_RADIUS: 500,
};

// User data
export const MOCK_USER = {
  name: 'Ayush Kumbhar',
  email: 'ayush.kumbhar@example.com',
  avatar: undefined, // Set to image URL if you have one
  memberSince: '2024-01-15',
};

// Dashboard stats
export const MOCK_STATS = {
  totalTrips: 124,
  rewardsPoints: 850,
  savedRoutes: 8,
  carbonSaved: '42kg',
};

// Recent trips
export const MOCK_RECENT_TRIPS = [
  {
    id: '1',
    route: '42',
    from: 'Central Station',
    to: 'Downtown',
    date: 'Today, 8:30 AM',
    status: 'completed' as const,
    duration: '25 min',
  },
  {
    id: '2',
    route: '23',
    from: 'University',
    to: 'Shopping Mall',
    date: 'Yesterday, 2:15 PM',
    status: 'completed' as const,
    duration: '18 min',
  },
  {
    id: '3',
    route: '7',
    from: 'Airport',
    to: 'Tech Hub',
    date: 'Oct 16, 9:00 AM',
    status: 'cancelled' as const,
    duration: '35 min',
  },
];

// Notifications
export const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Route Added',
    message: 'Route 99 now connects Downtown to Beach Front with stops at Marina Bay and Sunset Park. Service starts from 6:00 AM daily.',
    type: 'info' as const,
    date: '2 hours ago',
  },
  {
    id: '2',
    title: 'Service Delay',
    message: 'Route 42 experiencing 10-minute delays due to traffic congestion on Main Street. We apologize for any inconvenience.',
    type: 'warning' as const,
    date: '30 min ago',
  },
  {
    id: '3',
    title: 'Trip Completed',
    message: 'Your trip from Central Station to Downtown has been completed successfully. You earned 15 reward points!',
    type: 'success' as const,
    date: 'Today, 9:00 AM',
  },
  {
    id: '4',
    title: 'Scheduled Maintenance',
    message: 'Route 23 will undergo scheduled maintenance this weekend from 10:00 PM to 6:00 AM. Alternative routes available.',
    type: 'info' as const,
    date: 'Yesterday',
  },
];
