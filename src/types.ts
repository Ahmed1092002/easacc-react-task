export type AuthMode = 'demo' | 'full';
export type LoginProvider = 'google' | 'facebook';

export type UserProfile = {
  email: string;
  name: string;
  provider: LoginProvider;
};

export type DeviceOption = {
  id: string;
  name: string;
};

export type AppSettings = {
  authMode: AuthMode;
  currentUser: UserProfile | null;
  selectedDevice: DeviceOption | null;
  webUrl: string;
};

export type RootStackParamList = {
  Login: undefined;
  Settings: undefined;
  WebView: undefined;
};
