# Community Transit - Expo Mobile App 📱

A real-time community transit tracking application built with React Native and Expo.

## 🚀 Features

- **Real-time Bus Tracking**: View live bus locations on an interactive map
- **Location Services**: Automatic user location detection
- **Interactive Markers**: Tap buses to see route info, arrival times, and passenger counts
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Native Maps**: Uses Google Maps on Android and Apple Maps on iOS
- **Beautiful UI**: Modern design with smooth animations

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or newer) - [Download here](https://nodejs.org/)
- **npm** or **yarn**
- **Expo CLI** (will be installed with dependencies)
- For iOS development: **macOS** with **Xcode**
- For Android development: **Android Studio**

## 🛠️ Setup Instructions

### Step 1: Install Dependencies

First, backup your old package.json and use the new one:

```powershell
# Backup your current package.json
Copy-Item package.json package-web-backup.json

# Copy the Expo package.json
Copy-Item package-expo.json package.json

# Install dependencies
npm install
```

### Step 2: Install Expo CLI Globally (Optional)

```powershell
npm install -g expo-cli
```

### Step 3: Get Google Maps API Key (for Android)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Maps SDK for Android** and **Maps SDK for iOS**
4. Create credentials (API Key)
5. Copy your API key

### Step 4: Configure Google Maps

Open `app.json` and replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_ACTUAL_API_KEY_HERE"
    }
  }
}
```

## 🚀 Running the App

### Development Mode

**Start Expo development server:**
```powershell
npm start
```

This will open Expo DevTools in your browser.

### Run on iOS Simulator

```powershell
npm run ios
```

**Requirements:**
- macOS only
- Xcode installed
- iOS Simulator configured

### Run on Android Emulator

```powershell
npm run android
```

**Requirements:**
- Android Studio installed
- Android emulator configured

### Run on Physical Device

1. Install **Expo Go** app from App Store or Google Play
2. Run `npm start`
3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

### Run on Web

```powershell
npm run web
```

Opens in your default browser at `http://localhost:8081`

## 📁 Project Structure

```
community-transit/
├── app/                      # Expo Router pages
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Main map screen
├── components/
│   └── mobile/              # Mobile-specific components
│       ├── AdBanner.tsx
│       ├── BottomNav.tsx
│       └── MapControls.tsx
├── assets/                   # Images, icons, fonts
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies

```

## 🎨 Customization

### Change Initial Location

Edit `app/index.tsx`:

```typescript
const [userLocation, setUserLocation] = useState({
  latitude: YOUR_LATITUDE,    // Change these
  longitude: YOUR_LONGITUDE,  // Change these
});
```

### Modify Theme Colors

Edit `tailwind.config.js` to change the teal accent color.

### Add More Bus Routes

Edit the `generateMockBuses` function in `app/index.tsx`.

## 🔧 Building for Production

### Create Development Build

```powershell
npm run prebuild
```

### Build for iOS

```powershell
npm run build:ios
```

### Build for Android

```powershell
npm run build:android
```

**Note:** Building requires an [Expo account](https://expo.dev/signup). Sign up for free!

## 📱 Features Breakdown

### Current Features ✅

- ✅ Interactive map with pan/zoom
- ✅ Real-time bus location updates (mock data)
- ✅ User location detection
- ✅ Bus info popups
- ✅ Bottom navigation
- ✅ Map controls
- ✅ Ad banner
- ✅ Status indicators

### Coming Soon 🚧

- 🚧 Real transit API integration
- 🚧 Route planning
- 🚧 Arrival notifications
- 🚧 Favorite stops
- 🚧 Offline support
- 🚧 User authentication

## 🔐 Permissions

The app requests these permissions:

**iOS:**
- Location (When In Use)
- Location (Always) - for background tracking

**Android:**
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION

## 🐛 Troubleshooting

### "Cannot find module 'expo'" Error

```powershell
rm -rf node_modules
npm install
```

### Metro Bundler Cache Issues

```powershell
npx expo start -c
```

### iOS Build Fails

Ensure Xcode Command Line Tools are installed:
```bash
xcode-select --install
```

### Android Build Fails

Ensure Android SDK is properly configured in Android Studio.

## 📚 Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Native Maps** - Native map views
- **Expo Location** - Geolocation services
- **Lucide React Native** - Icon library
- **NativeWind** - Tailwind CSS for React Native

## 🤝 Contributing

This is a demo project. Feel free to fork and customize!

## 📄 License

MIT License - Feel free to use for your own projects!

## 🆘 Support

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)

## 🎯 Next Steps

1. ✅ Run `npm install`
2. ✅ Add Google Maps API key to `app.json`
3. ✅ Run `npm start`
4. ✅ Scan QR code with Expo Go app
5. 🎉 Start developing!

---

**Happy Coding! 🚀**
