# Easacc React Native Learning Branch

This branch is a clean Expo React Native rebuild of the Easacc task. It is meant to be easy to run and easy to learn from.

Other branches are still available:

- `main`: React Vite web app.
- `with-capacitor`: React Vite app wrapped with Capacitor.
- `react-native-expo-learning`: this Expo React Native learning branch.

## What This App Contains

- Login screen.
- Settings screen.
- WebView screen.
- Demo/mock social login.
- Saved website URL.
- Mock device selection.
- Local persistence with AsyncStorage.
- React Navigation native stack.
- WebView rendering with `react-native-webview`.

## Why This Branch Starts Simple

React Native has a different runtime than the browser. Web APIs like `localStorage`, `iframe`, and normal HTML elements do not exist.

This branch starts with simple React Native equivalents first:

- `localStorage` -> `AsyncStorage`
- `iframe` -> `react-native-webview`
- HTML elements -> `View`, `Text`, `TextInput`, `Pressable`
- Browser routing -> React Navigation
- Real Bluetooth -> mock device service first

Real Bluetooth and full Firebase auth can be added after the basic app flow is clear.

## Install

```bash
npm install
```

## Run

Start Expo:

```bash
npx expo start
```

Then choose one option:

- Press `a` for Android emulator.
- Press `i` for iOS simulator on macOS.
- Scan the QR code with Expo Go.

You can also use:

```bash
npm run android
npm run ios
npm run web
```

## Node Version Note

Expo/Metro may warn if Node is older than its preferred patch version.

Recommended:

```text
Node 22.13.0 or newer
```

Your current Node may still work, but upgrading removes the warning.

## Environment

Create `.env` from `.env.example`.

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

For learning, keep:

```env
EXPO_PUBLIC_USE_FULL_AUTH=false
```

That makes Google/Facebook buttons use mock users, so the app works immediately.

## Project Structure

```text
App.tsx                 App providers and navigation
index.ts                Expo entry point
src/screens             Login, Settings, WebView screens
src/components          Shared React Native UI pieces
src/services            Auth, storage, URL, mock device services
src/state               App context and app actions
src/types.ts            Shared TypeScript types
src/theme.ts            Colors and spacing
```

## Learning Flow

1. Open `App.tsx`.
2. See how `NavigationContainer` switches between Login and app screens.
3. Open `src/state/AppContext.tsx`.
4. See how app state is loaded and saved.
5. Open `src/screens/LoginScreen.tsx`.
6. See how demo login creates a mock user.
7. Open `src/screens/SettingsScreen.tsx`.
8. Save a URL and load mock devices.
9. Open `src/screens/WebViewScreen.tsx`.
10. See how the saved URL is rendered with `react-native-webview`.

## Commands

Type check:

```bash
npm run typecheck
```

Start Expo:

```bash
npm start
```

## Next Lessons

- Replace mock device service with real BLE.
- Add Firebase native/social auth.
- Add form validation polish.
- Add loading and offline states.
