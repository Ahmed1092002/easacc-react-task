# Easacc React Native Task

React Native / Expo application for Android and iOS.

The app contains the requested three pages:

1. Social media login page with Google and Facebook actions.
2. Settings page with a web URL input and Bluetooth device dropdown.
3. WebView page that opens the saved website URL.

## Features

- Google and Facebook login buttons.
- Environment-controlled auth mode.
- Editable website URL saved locally.
- Real Bluetooth device scan using `react-native-ble-plx`.
- Bluetooth devices displayed in a dropdown list.
- Selected device saved locally.
- Saved website shown with `react-native-webview`.
- WebView refresh and external open fallback.
- Local persistence with AsyncStorage.

## Tech Stack

- React Native
- Expo development build
- TypeScript
- React Navigation
- AsyncStorage
- react-native-webview
- react-native-ble-plx

## Requirements Coverage

### 1. Social Media Login

Implemented in:

```text
src/screens/LoginScreen.tsx
src/services/auth.ts
```

The login screen includes Google and Facebook actions. Demo mode works without external credentials. Full auth mode is controlled by environment variables.

### 2. Settings Page

Implemented in:

```text
src/screens/SettingsScreen.tsx
src/services/deviceService.ts
src/services/url.ts
src/services/storage.ts
```

The settings page allows the user to:

- Enter and save a website URL.
- Scan nearby Bluetooth devices.
- Select a discovered device from a dropdown list.
- Persist the selected device locally.

### 3. WebView Page

Implemented in:

```text
src/screens/WebViewScreen.tsx
```

The WebView page:

- Loads the saved URL.
- Shows the selected Bluetooth device context.
- Supports refresh.
- Provides an external browser fallback.

## Install

```bash
npm install
```

## Environment

Create a `.env` file from `.env.example`.

```env
EXPO_PUBLIC_USE_FULL_AUTH=false
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
EXPO_PUBLIC_FACEBOOK_APP_ID=
```

Use demo auth mode for local testing:

```env
EXPO_PUBLIC_USE_FULL_AUTH=false
```

## Run On Android

Real Bluetooth requires a development build. It will not work in Expo Go.

Connect an Android device with USB debugging enabled, then run:

```bash
npx expo run:android
```

After the development app is installed, start Metro with:

```bash
npx expo start --dev-client --lan --clear
```

Open the installed development app on the phone.

## Run On iOS

On macOS:

```bash
npx expo run:ios
```

Then start Metro:

```bash
npx expo start --dev-client --lan --clear
```

## Useful Commands

Type check:

```bash
npm run typecheck
```

Start Metro for the development build:

```bash
npx expo start --dev-client --lan --clear
```

## Notes

- Bluetooth scanning uses native code, so Expo Go is not supported for this feature.
- Android Bluetooth permissions are configured in `app.json`.
- iOS Bluetooth usage text is configured in `app.json`.
- The implemented network-device scan is Bluetooth-based.

