import AsyncStorage from '@react-native-async-storage/async-storage';
import { getConfiguredAuthMode } from './env';
import type { AppSettings, DeviceOption, LoginProvider, UserProfile } from '../types';

const keys = {
  currentUser: 'currentUser',
  lastLoginProvider: 'lastLoginProvider',
  selectedDevice: 'selectedDevice',
  webUrl: 'webUrl',
} as const;

async function getJson<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : null;
}

async function setJson<T>(key: string, value: T | null) {
  if (value === null) {
    await AsyncStorage.removeItem(key);
    return;
  }

  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadAppSettings(): Promise<AppSettings> {
  const [currentUser, selectedDevice, webUrl] = await Promise.all([
    getJson<UserProfile>(keys.currentUser),
    getJson<DeviceOption>(keys.selectedDevice),
    AsyncStorage.getItem(keys.webUrl),
  ]);

  return {
    authMode: getConfiguredAuthMode(),
    currentUser,
    selectedDevice,
    webUrl: webUrl ?? '',
  };
}

export async function saveCurrentUser(user: UserProfile | null, provider: LoginProvider | null) {
  await Promise.all([setJson(keys.currentUser, user), setJson(keys.lastLoginProvider, provider)]);
}

export async function saveSelectedDevice(device: DeviceOption | null) {
  await setJson(keys.selectedDevice, device);
}

export async function saveWebUrl(webUrl: string) {
  await AsyncStorage.setItem(keys.webUrl, webUrl);
}
