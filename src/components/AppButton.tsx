import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type AppButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export default function AppButton({ disabled = false, label, onPress, variant = 'primary' }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    color: colors.white,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.82,
  },
  secondary: {
    backgroundColor: colors.primarySoft,
  },
  secondaryLabel: {
    color: colors.primary,
  },
});
