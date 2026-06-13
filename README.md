# Easacc React Task

React Vite + Capacitor mobile app for Android and iOS.

## Features

- Social login page with Google and Facebook buttons.
- Demo auth mode that works without provider credentials.
- Full OAuth mode flag with credential checks for:
  - `VITE_GOOGLE_CLIENT_ID`
  - `VITE_FACEBOOK_APP_ID`
- Settings page for:
  - Saving a configurable website URL.
  - Switching auth mode.
  - Scanning nearby Bluetooth LE devices.
  - Selecting a discovered device from a dropdown.
- Web View page that:
  - Loads the saved URL in an iframe for web preview.
  - Checks network connectivity.
  - Opens the URL with Capacitor InAppBrowser fallback on mobile.

## Setup

```bash
npm install
```

Create `.env` from `.env.example` if you want to test full auth credential checks.

```bash
npm run dev
```

## Build

```bash
npm run build
npx cap sync
```

## Android

```bash
npm run android
```

Bluetooth scanning requires running on a real device or emulator with Bluetooth support.

## iOS

```bash
npm run ios
```

The iOS project is generated in `ios/`, but running it requires macOS and Xcode.

## Notes

Full Google/Facebook OAuth provider SDK flows still require real app credentials and provider callback configuration. Demo mode is the default so the app can be reviewed immediately.
