# Community Transit Map App

Community Transit Map is a cross-platform, community-powered bus tracking and sharing app for Kolhapur, Maharashtra. Built with React Native, Expo, and TypeScript, it enables commuters to view live bus locations, share their journeys, and access real-time crowd and route information—all on a beautiful, interactive map.

---

## 🚀 Features

- **Live Bus Tracking:** View real-time bus locations and routes on a map, updated every few seconds.
- **Share My Bus:** Commuters can share their current bus journey, including start location, destination, crowd level (low/medium/high), and the route banner (e.g., "Rankala → ST Stand").
- **Crowd Level & Route Info:** Each shared bus marker displays the crowd level and route banner for easy identification.
- **Map Integration:** All buses and shared journeys are shown on a real map, following actual road routes.
- **Interactive UI:** Tap buses to see info popups, focus the map, or track a specific journey.
- **Cross-Platform:** Runs on iOS, Android, and Web with native map support (Google Maps/Apple Maps).
- **Modern Design:** Smooth animations, beautiful UI, and responsive layouts.

Original Figma design: [Community Transit Map Screen](https://www.figma.com/design/Ufmxy5GlAXRT4udbwGHoz1/Community-Transit-Map-Screen)

---

## 🏗️ Architecture Overview

- **Frontend:** React Native (Expo), TypeScript
- **Map:** react-native-maps, expo-location
- **State:** React hooks (`useState`, `useEffect`)
- **UI Components:** Custom cards, badges, navigation, and map controls
- **Platform APIs:** Uses device GPS, native maps, and platform-specific features

See `ARCHITECTURE.md` for a detailed breakdown of components, data flow, and build process.

---

## 📦 Tech Stack

- **React Native** 0.81.4
- **Expo SDK** ~54.0.0
- **TypeScript**
- **react-native-maps** 1.20.1
- **expo-location** ~19.0.7
- **Lottie** for animations
- **Lucide React Native** for icons
- **Three.js** for 3D model support

---

## 📁 Project Structure

```
src/
  App.tsx                # App entry point
  components/             # UI components (cards, badges, nav, map controls)
  screens/                # Main screens (Home, Map, ShareMyBus)
  hooks/                  # Custom React hooks
  utils/                  # Utility functions (bus generator, Google Maps helpers)
  assets/                 # Animations, illustrations
  constants/              # Theme, mock data
  types/                  # TypeScript types
docs/                     # Documentation
```

---

## 🛠️ Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm start
   ```
3. **Run on device or emulator:**
   - For Expo: `npx expo start`
   - For web: `npm run web`

---

## 📱 Usage

- Tap the middle "Share My Bus" button in the navigation bar to share your journey.
- Enter your start location, destination, crowd level, and route banner (from the bus banner or your knowledge).
- Your live location will be shown on the map for others to see.
- All shared buses appear with a green marker and show their crowd level and route info.

---

## 🧩 Main Components

- **MapScreen:** Displays the map, bus markers, and user location
- **ShareMyBusScreen:** UI for sharing your journey
- **BusCard, BusDetailsCard:** Show bus info and details
- **BottomNav, MapControls:** Navigation and map interaction
- **NotificationPanel, SearchPanel:** Panels for notifications and search

---

## 📝 Contributing

Pull requests are welcome! Please open an issue first to discuss major changes or new features.

---

## 📄 License

MIT License

## ✅ Completed Tasks

- Fixed bus info panel not opening.
  - Debugged and ensured the BusInfoPanel is rendered and triggered correctly in `MapScreen` and `useBusNavigation`.
- Redesigned bus info panel UI to match the provided screenshot.
  - Updated the panel to include arrival time at the top, share button, progress slider, travel time, and a vertical timeline with stops, times, and current/next stop highlighting.
- Implemented clustering for bus markers to improve map clarity.
  - Used `react-native-map-clustering` to group nearby bus markers.
- Made bus markers responsive to zoom levels.
  - Adjusted marker sizes dynamically based on the map's zoom level.
- Added logic to handle bus journeys:
  - Removed buses from the map when they reach their destination.
  - Restarted bus journeys from the destination to the start point after a delay, reversing stops and updating the ETA.

## 🚧 Remaining Work

- Optimize performance for large numbers of buses on the map.
- Add unit tests for critical components like `BusMarker` and `MapScreen`.
- Improve error handling for edge cases (e.g., missing location permissions, network issues).
- Enhance the UI for clustering to show the number of buses in a cluster.
- Finalize documentation for clustering and responsive markers in `docs/`.
