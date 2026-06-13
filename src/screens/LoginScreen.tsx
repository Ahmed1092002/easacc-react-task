import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import AuthModeBadge from '../components/AuthModeBadge';
import Screen from '../components/Screen';
import StatusMessage from '../components/StatusMessage';
import { colors, spacing } from '../theme';
import { useApp } from '../state/AppContext';
import type { LoginProvider } from '../types';

export default function LoginScreen() {
  const { authMode, signIn } = useApp();
  const [error, setError] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<LoginProvider | null>(null);

  async function handleLogin(provider: LoginProvider) {
    setError('');
    setLoadingProvider(provider);

    try {
      await signIn(provider);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed.');
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <Screen>
      <View style={styles.panel}>
        <View>
          <Text style={styles.eyebrow}>React Native learning branch</Text>
          <Text style={styles.title}>Easacc Mobile Portal</Text>
          <Text style={styles.subtitle}>Start with a simple Expo app, then learn each screen step by step.</Text>
        </View>

        <AuthModeBadge authMode={authMode} />

        <View style={styles.buttons}>
          <AppButton
            disabled={loadingProvider !== null}
            label={loadingProvider === 'google' ? 'Signing in...' : 'Continue with Google'}
            onPress={() => void handleLogin('google')}
            variant="secondary"
          />
          <AppButton
            disabled={loadingProvider !== null}
            label={loadingProvider === 'facebook' ? 'Signing in...' : 'Continue with Facebook'}
            onPress={() => void handleLogin('facebook')}
            variant="secondary"
          />
        </View>

        <StatusMessage tone="error" message={error} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  buttons: {
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  panel: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.lg,
    marginTop: 72,
    padding: spacing.xl,
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 42,
    marginTop: spacing.sm,
  },
});
