import { Preferences } from '@capacitor/preferences';
import type { AppSettings, AuthMode, BluetoothDevice, LoginProvider, UserProfile } from '../types';

const keys = {
  authMode: 'authMode',
  currentUser: 'demoUser',
  lastLoginProvider: 'lastLoginProvider',
  selectedDevice: 'selectedDevice',
  webUrl: 'webUrl',
} as const;

async function getJson<T>(key: string): Promise<T | null> {
  const { value } = await Preferences.get({ key });
  return value ? (JSON.parse(value) as T) : null;
}

async function setJson<T>(key: string, value: T | null) {
  if (value === null) {
    await Preferences.remove({ key });
    return;
  }

  await Preferences.set({ key, value: JSON.stringify(value) });
}

export async function loadAppSettings(): Promise<AppSettings> {
  const [{ value: authModeValue }, { value: webUrlValue }, currentUser, selectedDevice, lastLoginProvider] = await Promise.all([
    Preferences.get({ key: keys.authMode }),
    Preferences.get({ key: keys.webUrl }),
    getJson<UserProfile>(keys.currentUser),
    getJson<BluetoothDevice>(keys.selectedDevice),
    getJson<LoginProvider>(keys.lastLoginProvider),
  ]);

  return {
    authMode: authModeValue === 'full' ? 'full' : 'demo',
    currentUser,
    lastLoginProvider,
    selectedDevice,
    webUrl: webUrlValue ?? '',
  };
}

export async function saveAuthMode(authMode: AuthMode) {
  await Preferences.set({ key: keys.authMode, value: authMode });
}

export async function saveCurrentUser(user: UserProfile | null, provider: LoginProvider | null) {
  await Promise.all([setJson(keys.currentUser, user), setJson(keys.lastLoginProvider, provider)]);
}

export async function saveSelectedDevice(device: BluetoothDevice | null) {
  await setJson(keys.selectedDevice, device);
}

export async function saveWebUrl(webUrl: string) {
  await Preferences.set({ key: keys.webUrl, value: webUrl });
}
