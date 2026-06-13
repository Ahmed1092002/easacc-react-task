import { StyleSheet, Text } from 'react-native';
import { colors } from '../theme';
import type { AuthMode } from '../types';

type AuthModeBadgeProps = {
  authMode: AuthMode;
};

export default function AuthModeBadge({ authMode }: AuthModeBadgeProps) {
  return <Text style={styles.badge}>Auth mode: {authMode === 'full' ? 'Full Firebase' : 'Demo mock'}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.successBg,
    borderRadius: 8,
    color: colors.success,
    fontWeight: '800',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
