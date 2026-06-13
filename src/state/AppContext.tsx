import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginWithProvider } from '../services/auth';
import { loadAppSettings, saveCurrentUser, saveSelectedDevice, saveWebUrl } from '../services/storage';
import type { AppSettings, DeviceOption, LoginProvider, UserProfile } from '../types';

type AppContextValue = AppSettings & {
  isReady: boolean;
  setSelectedDevice: (device: DeviceOption | null) => Promise<void>;
  setWebUrl: (url: string) => Promise<void>;
  signIn: (provider: LoginProvider) => Promise<void>;
  signOut: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

const initialSettings: AppSettings = {
  authMode: 'demo',
  currentUser: null,
  selectedDevice: null,
  webUrl: '',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadAppSettings()
      .then(setSettings)
      .finally(() => setIsReady(true));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...settings,
      isReady,
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
        setSettings((current) => ({ ...current, currentUser: user }));
      },
      async signOut() {
        await saveCurrentUser(null, null);
        setSettings((current) => ({ ...current, currentUser: null }));
      },
    }),
    [isReady, settings],
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
