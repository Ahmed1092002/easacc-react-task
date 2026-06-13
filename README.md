# Easacc React Developer Task

React Vite application for the Easacc task.

The repository has two branches:

- `main`: React Vite web version without Capacitor.
- `with-capacitor`: Android/iOS version using Capacitor.

## Requirements Covered

- Social login page with Google and Facebook actions.
- Settings page for saving a website URL.
- Device selector for Bluetooth-capable devices.
- Web View page that displays the saved website URL.
- Environment-controlled login mode.

## Branches

### `main`

This branch is a web-only React Vite app. It does not include Capacitor, Android, or iOS native folders.

Use this branch when you want the simplest web version:

```bash
git switch main
npm install
npm run dev
```

### `with-capacitor`

This branch keeps the Capacitor setup for Android and iOS.

Use this branch when you want the mobile app wrapper:

```bash
git switch with-capacitor
npm install
npm run build
npx cap sync
```

Android:

```bash
npx cap run android
```

iOS:

```bash
npx cap run ios
```

iOS requires macOS and Xcode.

## Environment Variables

Create a real `.env` file from `.env.example`.

Important: Vite reads `.env`, not `.env.example`. `.env.example` is only a sample file.

```env
VITE_USE_FULL_AUTH=false
VITE_GOOGLE_CLIENT_ID=
VITE_FACEBOOK_APP_ID=
```

### Auth Mode

`VITE_USE_FULL_AUTH=false`

Uses demo/mock login. This is the default and works without external credentials.

`VITE_USE_FULL_AUTH=true`

Starts the Google/Facebook OAuth flow and requires:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_FACEBOOK_APP_ID`

The project opens provider authorization URLs, but production token callback handling still needs real provider configuration.

After changing `.env`, restart the dev server:

```bash
npm run dev
```

## OAuth Setup

### Google Client ID

1. Open Google Cloud Console credentials:
   https://console.cloud.google.com/apis/credentials
2. Create or select a project.
3. Create an OAuth Client ID.
4. Choose `Web application`.
5. Add Authorized JavaScript origins:

```text
http://localhost:5173
http://127.0.0.1:5173
```

6. Add Authorized redirect URIs:

```text
http://localhost:5173/login
http://127.0.0.1:5173/login
```

7. Copy the generated Client ID into `.env`:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

The login page shows the exact redirect URI used by the app. If Google shows `redirect_uri_mismatch`, add that exact URI to the OAuth Client ID settings.

### Facebook App ID

1. Open Meta for Developers:
   https://developers.facebook.com/apps/
2. Create an app.
3. Go to `App settings` -> `Basic`.
4. Copy `App ID`.
5. Add Facebook Login if needed.
6. Add the valid OAuth redirect URI:

```text
http://localhost:5173/login
```

7. Add it to `.env`:

```env
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

## Main Features

### Login Page

- Google login button.
- Facebook login button.
- Auth mode is shown from `.env`.
- No UI dropdown is used to switch login mode.

### Settings Page

- Save a website URL.
- URL is normalized, so `example.com` becomes `https://example.com`.
- Scan/select a Bluetooth device.
- Save selected device and URL locally.

### Web View Page

- Loads the saved URL in an iframe on the web branch.
- Includes fallback buttons to open blocked websites in a new browser tab.
- Some websites, such as LinkedIn, block iframe embedding for security. That is expected browser behavior.

## Bluetooth Notes

On `main`, Bluetooth uses browser Web Bluetooth support. It works only in supported browsers and usually requires HTTPS or localhost.

On `with-capacitor`, Bluetooth scanning uses the Capacitor Bluetooth LE plugin and is intended for real Android/iOS devices.

## Commands

Install dependencies:

```bash
npm install
```

Run local development server:

```bash
npm run dev
```

Build production files:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Notes For Reviewers

- `main` is intentionally web-only.
- `with-capacitor` contains the Android/iOS implementation.
- Demo login is available without credentials.
- Full OAuth requires real provider app setup.
- Some websites cannot be embedded in the Web View because of `X-Frame-Options` or Content Security Policy headers.
