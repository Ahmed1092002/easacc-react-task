import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../components/AppButton';
import AuthModeBadge from '../components/AuthModeBadge';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import StatusMessage from '../components/StatusMessage';
import { scanForDevices } from '../services/deviceService';
import { normalizeUrl } from '../services/url';
import { colors, spacing } from '../theme';
import { useApp } from '../state/AppContext';
import type { DeviceOption, RootStackParamList } from '../types';

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { authMode, currentUser, selectedDevice, setSelectedDevice, setWebUrl, signOut, webUrl } = useApp();
  const [urlInput, setUrlInput] = useState(webUrl);
  const [devices, setDevices] = useState<DeviceOption[]>(selectedDevice ? [selectedDevice] : []);
  const [deviceMessage, setDeviceMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [urlSuccess, setUrlSuccess] = useState('');

  useEffect(() => {
    setUrlInput(webUrl);
  }, [webUrl]);

  async function handleSaveUrl() {
    setUrlError('');
    setUrlSuccess('');

    try {
      const normalized = normalizeUrl(urlInput);
      await setWebUrl(normalized);
      setUrlInput(normalized);
      setUrlSuccess('URL saved successfully.');
    } catch (error) {
      setUrlError(error instanceof Error ? error.message : 'Please enter a valid URL.');
    }
  }

  async function handleScanDevices() {
    setDeviceMessage('');
    setIsScanning(true);

    try {
      const results = await scanForDevices();
      setDevices(results);
      setDeviceMessage(results.length === 0 ? 'No devices found.' : 'Mock devices loaded.');
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Settings</Text>
          <Text style={styles.title}>App Configuration</Text>
        </View>
        <AppButton label="Sign out" onPress={() => void signOut()} variant="secondary" />
      </View>

      <SectionCard title="Website URL" description="Save a website URL, then open it on the WebView screen.">
        <Text style={styles.label}>Web URL</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="url"
          onChangeText={setUrlInput}
          placeholder="https://example.com"
          style={styles.input}
          value={urlInput}
        />
        <View style={styles.row}>
          <AppButton label="Save URL" onPress={() => void handleSaveUrl()} />
          <AppButton disabled={!webUrl} label="Open WebView" onPress={() => navigation.navigate('WebView')} variant="secondary" />
        </View>
        <StatusMessage tone="error" message={urlError} />
        <StatusMessage tone="success" message={urlSuccess} />
        {webUrl ? <Text style={styles.savedText}>Saved: {webUrl}</Text> : null}
      </SectionCard>

      <SectionCard title="Authentication" description="The env flag controls whether the app is demo or full mode.">
        <AuthModeBadge authMode={authMode} />
        {currentUser ? <Text style={styles.savedText}>Signed in as {currentUser.email}</Text> : null}
      </SectionCard>

      <SectionCard title="Mock Devices" description="This learning branch uses mock devices before adding real Bluetooth.">
        <AppButton
          disabled={isScanning}
          label={isScanning ? 'Scanning...' : 'Load mock devices'}
          onPress={() => void handleScanDevices()}
          variant="secondary"
        />
        {devices.map((device) => (
          <AppButton
            key={device.id}
            label={selectedDevice?.id === device.id ? `Selected: ${device.name}` : device.name}
            onPress={() => void setSelectedDevice(device)}
            variant={selectedDevice?.id === device.id ? 'primary' : 'secondary'}
          />
        ))}
        <StatusMessage tone="success" message={deviceMessage} />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  header: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  label: {
    color: colors.text,
    fontWeight: '800',
  },
  row: {
    gap: spacing.md,
  },
  savedText: {
    color: colors.muted,
    lineHeight: 21,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 4,
  },
});
