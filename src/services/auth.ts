import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { assertFirebaseConfig, firebaseAuth } from './firebase';
import type { AuthMode, LoginProvider, UserProfile } from '../types';

const providerLabels: Record<LoginProvider, string> = {
  facebook: 'Facebook',
  google: 'Google',
};

export function getConfiguredAuthMode(): AuthMode {
  return import.meta.env.VITE_USE_FULL_AUTH === 'true' ? 'full' : 'demo';
}

export function getOAuthRedirectUri(): string {
  return `${window.location.origin}/login`;
}

function createProvider(provider: LoginProvider) {
  if (provider === 'google') {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    return googleProvider;
  }

  const facebookProvider = new FacebookAuthProvider();
  facebookProvider.addScope('email');
  facebookProvider.addScope('public_profile');
  return facebookProvider;
}

export async function loginWithProvider(provider: LoginProvider, authMode: AuthMode): Promise<UserProfile> {
  if (authMode === 'demo') {
    return {
      email: 'demo@easacc.com',
      name: 'Demo User',
      provider,
    };
  }

  assertFirebaseConfig();

  const credential = await signInWithPopup(firebaseAuth, createProvider(provider));
  const { user } = credential;

  return {
    email: user.email ?? `${provider}@firebase.local`,
    name: user.displayName ?? `${providerLabels[provider]} User`,
    provider,
  };
}
