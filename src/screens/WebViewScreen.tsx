import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Linking, StyleSheet, Text, View } from 'react-native';
import WebView from 'react-native-webview';
import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import { getDeviceDescription, getDeviceLabel } from '../services/deviceService';
import { colors, spacing } from '../theme';
import { useApp } from '../state/AppContext';
import type { RootStackParamList } from '../types';

type WebViewScreenProps = NativeStackScreenProps<RootStackParamList, 'WebView'>;

export default function WebViewScreen({ navigation }: WebViewScreenProps) {
  const { selectedDevice, webUrl } = useApp();

  if (!webUrl) {
    return (
      <Screen>
        <SectionCard title="No URL saved" description="Add a website URL in settings first.">
          <AppButton label="Go to Settings" onPress={() => navigation.navigate('Settings')} />
        </SectionCard>
      </Screen>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Web View</Text>
          <Text style={styles.title}>{webUrl}</Text>
          {selectedDevice ? <Text style={styles.subtitle}>Printer: {getDeviceLabel(selectedDevice)}</Text> : null}
        </View>
        <AppButton label="Open externally" onPress={() => void Linking.openURL(webUrl)} variant="secondary" />
      </View>
      {selectedDevice ? (
        <View style={styles.deviceBar}>
          <Text style={styles.deviceBarTitle}>Selected network device</Text>
          <Text style={styles.deviceBarText}>{getDeviceDescription(selectedDevice)}</Text>
        </View>
      ) : null}
      <Text style={styles.note}>Some websites block embedded views. Use external open if the page refuses to load.</Text>
      <View style={styles.webviewBox}>
        <WebView source={{ uri: webUrl }} startInLoadingState />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deviceBar: {
    backgroundColor: colors.successBg,
    gap: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  deviceBarText: {
    color: colors.muted,
    fontWeight: '700',
  },
  deviceBarTitle: {
    color: colors.success,
    fontWeight: '900',
  },
  eyebrow: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  header: {
    backgroundColor: colors.background,
    gap: spacing.md,
    padding: spacing.lg,
  },
  note: {
    backgroundColor: '#eef8fb',
    color: '#34566a',
    fontWeight: '700',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  webviewBox: {
    flex: 1,
  },
});
