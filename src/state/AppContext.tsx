import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginWithProvider } from '../services/auth';
import {
  loadAppSettings,
  saveCurrentUser,
  saveSelectedDevice,
  saveWebUrl,
} from '../services/settingsStorage';
import type { AppSettings, AuthMode, BluetoothDevice, LoginProvider, UserProfile } from '../types';

type AppContextValue = {
  authMode: AuthMode;
  currentUser: UserProfile | null;
  isReady: boolean;
  lastLoginProvider: LoginProvider | null;
  selectedDevice: BluetoothDevice | null;
  setSelectedDevice: (device: BluetoothDevice | null) => Promise<void>;
  setWebUrl: (url: string) => Promise<void>;
  signIn: (provider: LoginProvider) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  webUrl: string;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({
    authMode: 'demo',
    currentUser: null,
    lastLoginProvider: null,
    selectedDevice: null,
    webUrl: '',
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadAppSettings()
      .then(setSettings)
      .finally(() => setIsReady(true));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      authMode: settings.authMode,
      currentUser: settings.currentUser,
      isReady,
      lastLoginProvider: settings.lastLoginProvider,
      selectedDevice: settings.selectedDevice,
      webUrl: settings.webUrl,
      async setSelectedDevice(device) {
        await saveSelectedDevice(device);
        setSettings((current) => ({ ...current, selectedDevice: device }));
      },
      async setWebUrl(webUrl) {
        await saveWebUrl(webUrl);
        setSettings((current) => ({ ...current, webUrl }));
      },
      async signIn(provider) {
        const user = await loginWithProvider(provider, settings.authMode);
        await saveCurrentUser(user, provider);
        setSettings((current) => ({
          ...current,
          currentUser: user,
          lastLoginProvider: provider,
        }));
        return user;
      },
      async signOut() {
        await saveCurrentUser(null, null);
        setSettings((current) => ({
          ...current,
          currentUser: null,
          lastLoginProvider: null,
        }));
      },
    }),
    [isReady, settings.authMode, settings.currentUser, settings.lastLoginProvider, settings.selectedDevice, settings.webUrl],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }

  return context;
}
