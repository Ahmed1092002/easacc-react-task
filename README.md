# Easacc React Native Learning Branch

This branch is a clean Expo React Native rebuild of the Easacc task. It is meant to be easy to run and easy to learn from.

Other branches are still available:

- `main`: React Vite web app.
- `with-capacitor`: React Vite app wrapped with Capacitor.
- `react-native-expo-learning`: this Expo React Native learning branch.

## What This App Contains

- Login screen with Google and Facebook buttons.
- Settings screen with a website URL input.
- Settings screen with a real Bluetooth device dropdown.
- WebView screen that opens the saved website URL.
- Demo/mock social login.
- Saved website URL.
- Real Bluetooth scan support for development builds.
- Local persistence with AsyncStorage.
- React Navigation native stack.
- WebView rendering with `react-native-webview`.

## How The Task Requirements Are Covered

1. Social media login:
   - `src/screens/LoginScreen.tsx`
   - Google and Facebook buttons are available.
   - Demo mode works immediately.

2. Settings page:
   - `src/screens/SettingsScreen.tsx`
   - User can enter and save a website URL.
   - User can scan for real Bluetooth devices.
   - Bluetooth devices appear in a dropdown list.
   - Selected device metadata is saved with AsyncStorage.

3. WebView page:
   - `src/screens/WebViewScreen.tsx`
   - The saved URL opens inside `react-native-webview`.
   - The selected device is shown as context above the WebView.
   - Refresh and external open fallback are available.

## Submission Checklist

- Login page has Facebook and Google actions.
- Settings page saves a user-editable web URL.
- Settings page shows real Bluetooth devices in a dropdown.
- WebView page loads the saved URL.
- Selected device and URL are persisted locally with AsyncStorage.
- Demo mode works without real OAuth credentials.
- Full auth and real device discovery are documented as next native steps.

## Why This Branch Starts Simple

React Native has a different runtime than the browser. Web APIs like `localStorage`, `iframe`, and normal HTML elements do not exist.

This branch starts with simple React Native equivalents first:

- `localStorage` -> `AsyncStorage`
- `iframe` -> `react-native-webview`
- HTML elements -> `View`, `Text`, `TextInput`, `Pressable`
- Browser routing -> React Navigation
- Real Bluetooth discovery -> `react-native-ble-plx`

Full Firebase auth and WiFi device discovery can be added after the basic app flow is clear.

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
src/services            Auth, storage, URL, Bluetooth device services
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
8. Save a URL and scan for Bluetooth devices.
9. Open `src/screens/WebViewScreen.tsx`.
10. See how the saved URL is rendered with `react-native-webview`.

## Network Devices

The task asks for:

```text
Access network devices (wifi - bluetooth) like a device in dropdown list.
```

In this branch, Bluetooth scanning is implemented with `react-native-ble-plx`:

```text
src/services/deviceService.ts
```

The Bluetooth service returns discovered BLE devices with:

- device name
- protocol: `bluetooth`
- Bluetooth device ID/address
- signal strength
- reachable state

Real BLE scanning only works in a native development build. Expo Go cannot run this native module.

For real device discovery later:

- Bluetooth devices use `react-native-ble-plx` in this branch.
- WiFi device discovery usually needs mDNS/Bonjour, local network scanning, device SDKs, or a backend service.
- Native Bluetooth requires an Expo development build, not plain Expo Go.
- Android needs Bluetooth and sometimes location permissions.
- iOS needs Bluetooth and local network usage descriptions in native config.

## Real Bluetooth Development Build

Real Bluetooth scanning cannot run inside the normal Expo Go app because Expo Go does not include the native BLE module.

Use this flow when you are ready to test real Bluetooth on Android:

```bash
npx expo prebuild
npx expo run:android
```

After the development app is installed on the phone, start Metro with:

```bash
npx expo start --dev-client --lan --clear
```

Then open the installed development app, not Expo Go.

Bluetooth files to learn from:

```text
src/services/deviceService.ts
app.json
```

Current behavior:

- In a development build, the app requests Bluetooth permissions and scans nearby BLE devices.
- In Expo Go, the app shows no fake devices and explains that native BLE needs a development build.
- WiFi device discovery is not mocked. It should be added later as a separate real feature.

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

- Add real WiFi device discovery with mDNS, vendor SDK, or backend discovery.
- Add Firebase native/social auth.
- Add form validation polish.
- Add loading and offline states.



