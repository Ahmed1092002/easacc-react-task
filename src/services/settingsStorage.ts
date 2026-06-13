import { getConfiguredAuthMode } from './auth';
import type { AppSettings, BluetoothDevice, LoginProvider, UserProfile } from '../types';

const keys = {
  authMode: 'authMode',
  currentUser: 'demoUser',
  lastLoginProvider: 'lastLoginProvider',
  selectedDevice: 'selectedDevice',
  webUrl: 'webUrl',
} as const;

async function getJson<T>(key: string): Promise<T | null> {
  const value = window.localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : null;
}

async function setJson<T>(key: string, value: T | null) {
  if (value === null) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export async function loadAppSettings(): Promise<AppSettings> {
  const [currentUser, selectedDevice, lastLoginProvider] = await Promise.all([
    getJson<UserProfile>(keys.currentUser),
    getJson<BluetoothDevice>(keys.selectedDevice),
    getJson<LoginProvider>(keys.lastLoginProvider),
  ]);

  return {
    authMode: getConfiguredAuthMode(),
    currentUser,
    lastLoginProvider,
    selectedDevice,
    webUrl: window.localStorage.getItem(keys.webUrl) ?? '',
  };
}

export async function saveCurrentUser(user: UserProfile | null, provider: LoginProvider | null) {
  await Promise.all([setJson(keys.currentUser, user), setJson(keys.lastLoginProvider, provider)]);
}

export async function saveSelectedDevice(device: BluetoothDevice | null) {
  await setJson(keys.selectedDevice, device);
}

export async function saveWebUrl(webUrl: string) {
  window.localStorage.setItem(keys.webUrl, webUrl);
}
