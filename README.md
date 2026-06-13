# Easacc React Task

React Vite web app for the Easacc task.

## Branches

- `main`: React Vite web version without Capacitor.
- `with-capacitor`: Android/iOS Capacitor version.

## Features

- Social login page with Google and Facebook buttons.
- Demo/mock login by default.
- Full OAuth mode controlled by `.env`:
  - `VITE_USE_FULL_AUTH=false` uses demo/mock login.
  - `VITE_USE_FULL_AUTH=true` opens Google/Facebook OAuth URLs and requires provider credentials.
- Settings page for saving a configurable website URL.
- Bluetooth device picker using browser Web Bluetooth where supported.
- Web View page that loads the saved URL in an iframe and offers a browser fallback.

## Setup

```bash
npm install
```

Create `.env` from `.env.example`.

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Notes

The `main` branch intentionally does not include Capacitor, Android, or iOS native folders. Switch to `with-capacitor` when you need the native mobile implementation.
