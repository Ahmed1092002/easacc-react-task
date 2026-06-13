import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

type SectionCardProps = {
  children: React.ReactNode;
  description?: string;
  title: string;
};

export default function SectionCard({ children, description, title }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  description: {
    color: colors.muted,
    lineHeight: 21,
    marginTop: 6,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
});
