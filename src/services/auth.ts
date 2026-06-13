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

function openOAuthWindow(provider: LoginProvider) {
  const redirectUri = getOAuthRedirectUri();
  const authUrl =
    provider === 'google'
      ? new URL('https://accounts.google.com/o/oauth2/v2/auth')
      : new URL('https://www.facebook.com/v19.0/dialog/oauth');

  if (provider === 'google') {
    authUrl.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('prompt', 'select_account');
  } else {
    authUrl.searchParams.set('client_id', import.meta.env.VITE_FACEBOOK_APP_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', 'email,public_profile');
  }

  window.open(authUrl.toString(), '_blank', 'noopener,noreferrer,width=480,height=720');
}

export async function loginWithProvider(provider: LoginProvider, authMode: AuthMode): Promise<UserProfile> {
  if (authMode === 'demo') {
    return {
      email: 'demo@easacc.com',
      name: 'Demo User',
      provider,
    };
  }

  const missingCredential =
    provider === 'google' ? !import.meta.env.VITE_GOOGLE_CLIENT_ID : !import.meta.env.VITE_FACEBOOK_APP_ID;

  if (missingCredential) {
    throw new Error(`Full ${providerLabels[provider]} login is not configured. Switch to demo mode or add credentials.`);
  }

  openOAuthWindow(provider);

  throw new Error(
    `${providerLabels[provider]} login was opened. Complete the production callback configuration to read the returned token.`,
  );
}
