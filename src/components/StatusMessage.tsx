import { StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type StatusMessageProps = {
  message?: string;
  tone: 'error' | 'success';
};

export default function StatusMessage({ message, tone }: StatusMessageProps) {
  if (!message) {
    return null;
  }

  return <Text style={[styles.message, tone === 'error' ? styles.error : styles.success]}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    backgroundColor: colors.dangerBg,
    color: colors.danger,
  },
  message: {
    borderRadius: 8,
    fontWeight: '800',
    lineHeight: 20,
    padding: 12,
  },
  success: {
    backgroundColor: colors.successBg,
    color: colors.success,
  },
});
