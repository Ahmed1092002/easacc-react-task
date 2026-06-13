export type AuthMode = 'demo' | 'full';
export type LoginProvider = 'google' | 'facebook';

export type UserProfile = {
  email: string;
  name: string;
  provider: LoginProvider;
};

export type BluetoothDevice = {
  deviceId: string;
  name: string;
  rssi?: number;
};

export type AppSettings = {
  authMode: AuthMode;
  currentUser: UserProfile | null;
  lastLoginProvider: LoginProvider | null;
  selectedDevice: BluetoothDevice | null;
  webUrl: string;
};
