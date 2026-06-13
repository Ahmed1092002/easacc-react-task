# Easacc React Developer Task

React Vite application for the Easacc task.

The repository has two branches:

- `main`: React Vite web version without Capacitor.

## Requirements Covered

- Social login page with Google and Facebook actions.
- Settings page for saving a website URL.
- Device selector for Bluetooth-capable devices.
- Web View page that displays the saved website URL.
- Environment-controlled login mode.

## Branches

### `main`

This branch is a web-only React Vite app.

Use this branch when you want the simplest web version:

```bash
npm install
npm run dev
```

## Environment Variables

Create a real `.env` file from `.env.example`.

Important: Vite reads `.env`, not `.env.example`. `.env.example` is only a sample file.

```env
VITE_USE_FULL_AUTH=false
VITE_GOOGLE_CLIENT_ID=
VITE_FACEBOOK_APP_ID=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Auth Mode

`VITE_USE_FULL_AUTH=false`

Uses demo/mock login. This is the default and works without external credentials.

`VITE_USE_FULL_AUTH=true`

Starts Firebase Authentication with Google/Facebook popup sign-in and requires Firebase web configuration:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

The old direct OAuth variables can stay in `.env.example`, but full login now uses Firebase Auth as the login package.

After changing `.env`, restart the dev server:

```bash
npm run dev
```

## OAuth Setup

### Firebase Setup

The project uses the Firebase modular SDK:

```bash
npm install firebase
```

Create a Firebase project, add a Web App, and copy the Firebase config values into `.env`.

In Firebase Console:

1. Open `Authentication`.
2. Open `Sign-in method`.
3. Enable `Google`.
4. Enable `Facebook` if you want Facebook login.
5. Add your local domain in Firebase authorized domains if needed:

```text
localhost
127.0.0.1
```

### Google Provider

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

7. In Firebase Console, enable the Google provider.

If you use Firebase Auth popup sign-in, Firebase handles most of the client login flow. Google configuration is still needed behind Firebase for production apps.

### Facebook Provider

1. Open Meta for Developers:
   https://developers.facebook.com/apps/
2. Create an app.
3. Go to `App settings` -> `Basic`.
4. Copy `App ID` and `App Secret`.
5. In Firebase Console, enable Facebook sign-in.
6. Paste the Facebook `App ID` and `App Secret` into Firebase.
7. Copy the OAuth redirect URI shown by Firebase into your Facebook app settings.

The Firebase callback usually looks like:

```text
https://your-project-id.firebaseapp.com/__/auth/handler
```

The app also shows its local redirect URI on the login page for manual OAuth troubleshooting:

```text
http://localhost:5173/login
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
