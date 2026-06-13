import { getFirebaseConfig } from './env';
import type { AuthMode, LoginProvider, UserProfile } from '../types';

const providerLabels: Record<LoginProvider, string> = {
  facebook: 'Facebook',
  google: 'Google',
};

function getMissingFirebaseKeys() {
  return Object.entries(getFirebaseConfig())
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export async function loginWithProvider(provider: LoginProvider, authMode: AuthMode): Promise<UserProfile> {
  if (authMode === 'demo') {
    return {
      email: 'demo@easacc.com',
      name: 'Demo User',
      provider,
    };
  }

  const missingKeys = getMissingFirebaseKeys();
  if (missingKeys.length > 0) {
    throw new Error(`Firebase full auth is missing: ${missingKeys.join(', ')}.`);
  }

  throw new Error(
    `${providerLabels[provider]} full auth is prepared for a later lesson. Switch EXPO_PUBLIC_USE_FULL_AUTH=false to keep learning with demo login.`,
  );
}
