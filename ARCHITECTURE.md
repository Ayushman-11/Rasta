# 🏗️ Expo App Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR EXPO APP                            │
│                 (Community Transit)                         │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    ┌──────┐          ┌──────────┐        ┌─────────┐
    │  iOS │          │ Android  │        │   Web   │
    └──────┘          └──────────┘        └─────────┘
   Apple Maps       Google Maps          Browser Map
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                    ┌───────▼────────┐
                    │  React Native  │
                    │   Components   │
                    └────────────────┘
```

## 📱 Component Architecture

```
app/
├── _layout.tsx                    ← Root Layout (Expo Router)
│   ├── StatusBar
│   └── Stack Navigator
│
└── index.tsx                      ← Main Screen
    ├── MapView (react-native-maps)
    │   ├── User Location Circle
    │   └── Bus Markers (15x)
    │       └── Passenger Badge
    │
    ├── UI Components
    │   ├── AdBanner
    │   │   └── Close Button
    │   │
    │   ├── BottomNav
    │   │   ├── Menu Button
    │   │   ├── Rewards Button
    │   │   ├── Main Action Button (Center)
    │   │   ├── Offers Button
    │   │   └── Support Button
    │   │
    │   ├── MapControls
    │   │   ├── Info Button
    │   │   ├── Search Button
    │   │   ├── Location Button
    │   │   └── Navigation Button
    │   │
    │   ├── Free Minutes Badge
    │   │
    │   └── Status Badge
    │       └── "X buses nearby"
    │
    └── Bus Info Popup (conditional)
        ├── Route Number
        ├── Passenger Count
        ├── Arrival Time
        └── Track Button
```

## 🔄 Data Flow

```
User Opens App
     │
     ▼
Request Location Permission
     │
     ├─── ✅ Granted ──────► Get GPS Coordinates
     │                              │
     └─── ❌ Denied ──────► Use Default (London)
                                    │
                                    ▼
                          Generate Mock Buses (15x)
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
            Display on Map                  Update Every 5s
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │                               │
             User Taps Bus                   User Interacts
                    │                               │
                    ▼                               ▼
            Show Bus Info                   Pan/Zoom Map
              Popup                         Center Location
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                            "Track this bus"
                                 (Alert)
```

## 🛠️ Technology Stack

```
┌─────────────────────────────────────────┐
│         User Interface Layer            │
├─────────────────────────────────────────┤
│  • TouchableOpacity (Buttons)          │
│  • View (Containers)                   │
│  • Text (Labels)                       │
│  • StyleSheet (Styling)                │
└─────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Component Layer                 │
├─────────────────────────────────────────┤
│  • AdBanner.tsx                        │
│  • BottomNav.tsx                       │
│  • MapControls.tsx                     │
└─────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Map & Location Layer            │
├─────────────────────────────────────────┤
│  • react-native-maps                   │
│  • expo-location                       │
│  • Marker Components                   │
└─────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         State Management                │
├─────────────────────────────────────────┤
│  • useState (userLocation)             │
│  • useState (buses)                    │
│  • useState (selectedBus)              │
│  • useState (showAd)                   │
│  • useEffect (location & updates)      │
└─────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Core Libraries                  │
├─────────────────────────────────────────┤
│  • React 18.3.1                        │
│  • React Native 0.76.5                 │
│  • Expo SDK ~52.0.0                    │
│  • TypeScript                          │
└─────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Native Platform APIs            │
├─────────────────────────────────────────┤
│  iOS: CoreLocation, MapKit             │
│  Android: Google Play Services         │
│  Web: Geolocation API, Web Maps        │
└─────────────────────────────────────────┘
```

## 📊 State Management

```typescript
// Main State Variables

userLocation: {
  latitude: number,
  longitude: number
}
│
├─► Used for: Map centering
├─► Updated by: GPS / Default
└─► Triggers: Bus generation

buses: BusData[] (15 items)
│
├─► Contains: id, lat, lng, route, passengers, time
├─► Updated: Every 5 seconds (simulated movement)
└─► Displayed: As markers on map

selectedBus: BusData | null
│
├─► Tracks: Currently selected bus
├─► Shows: Info popup
└─► Toggles: On marker tap

showAd: boolean
│
├─► Controls: Ad banner visibility
└─► Dismissible: Via close button

mapRef: RefObject<MapView>
│
├─► Controls: Map programmatically
└─► Used for: Centering on user location
```

## 🌐 Platform-Specific Features

```
┌──────────────┬──────────────┬──────────────┐
│     iOS      │   Android    │     Web      │
├──────────────┼──────────────┼──────────────┤
│ Apple Maps   │ Google Maps  │ Web Maps     │
│ CoreLocation │ GPS Services │ Geolocation  │
│ Native Touch │ Native Touch │ Mouse/Touch  │
│ App Store    │ Play Store   │ Browser      │
│ Push (APNs)  │ Push (FCM)   │ Web Push     │
└──────────────┴──────────────┴──────────────┘
```

## 🚀 Build & Deploy Flow

```
Development
     │
     ├─► npm start
     │   ├─► Expo Go (Quick testing)
     │   └─► Metro Bundler
     │
     ├─► npm run ios
     │   └─► iOS Simulator (Mac only)
     │
     └─► npm run android
         └─► Android Emulator

Production
     │
     ├─► npm run build:ios
     │   └─► Generates .ipa file
     │       └─► Submit to App Store
     │
     └─► npm run build:android
         └─► Generates .aab/.apk file
             └─► Submit to Play Store
```

This architecture gives you maximum flexibility and reach across all platforms! 🎯
