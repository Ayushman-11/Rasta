

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

### Prerequisites
- Node.js (v18+), npm
- Go (v1.21+)
- Expo CLI: `npm install -g @expo/cli`
- Google Cloud account (for Maps API)
- MongoDB Atlas account (for database)

### Frontend Setup
1. **Clone the repo:**
   ```sh
   git clone <repo-url>
   cd Rasta
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```
   This installs React Native, Expo, AsyncStorage, dotenv, etc.

3. **Set up environment:**
   - Create `.env` in root: `GOOGLE_MAPS_API_KEY=your-key-here`
   - Follow "Setup APIs and Database" for keys.

4. **Start the development server:**
   ```sh
   npx expo start
   ```
   Or for web: `npm run web`

### Backend Setup
1. **Navigate to backend:**
   ```sh
   cd transit-backend
   ```

2. **Install Go dependencies:**
   ```sh
   go mod tidy
   ```
   This downloads Gin, Gorilla WebSocket, MongoDB driver, godotenv.

3. **Set up environment:**
   - Create `.env`: `MONGODB_PASSWORD=your-password-here`

4. **Run the backend:**
   ```sh
   go run main.go
   ```
   Starts on http://localhost:8080

### Full App
- Run backend in one terminal.
- Run `npx expo start` in another.
- Test as per "Testing the App".

---

## 🔧 Setup APIs and Database

### Google Maps API Key
The app uses Google Maps for geocoding (address to coordinates) and directions (route polylines). Follow these steps to get a free API key:

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project (e.g., "Community Transit App").

2. **Enable APIs:**
   - In the console, go to "APIs & Services" > "Library".
   - Search and enable:
     - **Geocoding API**
     - **Directions API**
     - **Maps SDK for Android** (for Android builds)
     - **Maps SDK for iOS** (for iOS builds)

3. **Create API Key:**
   - Go to "APIs & Services" > "Credentials".
   - Click "Create Credentials" > "API Key".
   - Copy the key.

4. **Restrict the Key (Security):**
   - Edit the key > "Application restrictions" > "Android apps" or "iOS apps".
   - For Android: Enter package name (from `app.json`: `com.rudraksh.communitytransit`) and SHA-1 fingerprint (run `expo fetch:android:hashes` in project).
   - For iOS: Enter bundle ID (`com.rudraksh.communitytransit`).
   - Under "API restrictions", select the enabled APIs above.

5. **Add to App:**
   - Create `.env` in project root: `GOOGLE_MAPS_API_KEY=your-key-here`
   - Ensure `.env` is in `.gitignore`.

6. **Test:**
   - Run app, share a bus with a valid address (e.g., "ST Stand, Kolhapur").
   - Check console for geocoding success.

**Free Tier:** $200/month credit; geocoding ~$5/1,000 requests.

### MongoDB Database (Atlas)
For onboard user tracking, use MongoDB Atlas for cloud database.

1. **Sign Up:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas).
   - Create free account, choose M0 cluster (free, 512MB storage).

2. **Create Cluster:**
   - Select provider (AWS), region (Asia South for India), create cluster.
   - Wait for setup (5-10 min).

3. **Create Database User:**
   - Go to "Database Access" > "Add New Database User".
   - Username: `transit_user`, Password: (secure, e.g., 12+ chars).
   - Built-in Role: `Read and write`.

4. **Whitelist IP:**
   - Go to "Network Access" > "Add IP Address".
   - Add `0.0.0.0/0` (allow all for dev; restrict for prod).

5. **Get Connection String:**
   - Go to "Clusters" > "Connect" > "Connect your application".
   - Choose "Go" > Copy string: `mongodb+srv://transit_user:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0`
   - Replace `<password>` with your password.

6. **Add to Backend:**
   - In `transit-backend/.env`: `MONGODB_PASSWORD=your-password-here`
   - Run backend: `cd transit-backend && go run main.go`

7. **Test:**
   - Use MongoDB Compass to connect with the string.
   - Share a bus in app, check if data appears in `transit_db.buses` collection.

**Free Tier:** M0 cluster is free with limits.

---



## 📱 Usage

- Tap the middle "Share My Bus" button in the navigation bar to share your journey.
- Enter your start location, destination, crowd level, and route banner (from the bus banner or your knowledge).
- Your live location will be shown on the map for others to see.
- All shared buses appear with a green marker and show their crowd level and route info.

---

## 🧪 Testing the App

### Prerequisites
- Set up Google Maps API key and MongoDB as per "Setup APIs and Database".
- Run backend: `cd transit-backend && go run main.go` (ensure `.env` has password).
- Start app: `npx expo start`.

### Test Scenarios
1. **Share a Bus Journey:**
   - Open app, go to "Share My Bus".
   - Select destination (e.g., "ST Stand") from dropdown.
   - Choose crowd level (e.g., 😊 Low).
   - Select route (e.g., "Bus 27").
   - Tap "Share" → Should geocode, fetch route, save to DB, show success.

2. **View Onboard Users on Map:**
   - Go to "Map" screen.
   - See green markers for shared buses.
   - Tap marker → Popup with details.
   - Check "Onboard: X" badge updates.

3. **Real-Time Tracking:**
   - Share on one device/emulator.
   - Open on another → Should fetch and display shared bus.
   - Use MongoDB Compass to verify data in `transit_db.buses`.

4. **Edge Cases:**
   - Invalid address → Fallback to mock route.
   - No GPS → Error alert.
   - Multiple shares → Unique IDs, no duplicates.

### Debugging
- Check Expo console for API errors.
- Backend logs for DB connection.
- Use `console.log` in code for flow verification.

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
  