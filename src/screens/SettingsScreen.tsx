import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../components/AppButton';
import AuthModeBadge from '../components/AuthModeBadge';
import Screen from '../components/Screen';
import SectionCard from '../components/SectionCard';
import StatusMessage from '../components/StatusMessage';
import { getDeviceDescription, getDeviceLabel, scanForNetworkDevices } from '../services/deviceService';
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
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false);
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
      const result = await scanForNetworkDevices();
      setDevices(result.devices);
      setIsDeviceDropdownOpen(result.devices.length > 0);
      setDeviceMessage(result.devices.length === 0 ? 'No Bluetooth devices found.' : result.note);
    } finally {
      setIsScanning(false);
    }
  }

  async function handleSelectDevice(device: DeviceOption) {
    await setSelectedDevice(device);
    setIsDeviceDropdownOpen(false);
    setDeviceMessage(`${getDeviceLabel(device)} selected.`);
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

      <SectionCard
        title="Network Device"
        description="Scan for nearby Bluetooth devices, then choose one from the dropdown."
      >
        <AppButton
          disabled={isScanning}
          label={isScanning ? 'Scanning Bluetooth...' : 'Scan Bluetooth'}
          onPress={() => void handleScanDevices()}
          variant="secondary"
        />
        <Text style={styles.label}>Device dropdown</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setIsDeviceDropdownOpen((current) => !current)}
          style={styles.dropdownButton}
        >
          <Text style={selectedDevice ? styles.dropdownText : styles.placeholderText}>
            {selectedDevice ? getDeviceLabel(selectedDevice) : 'No device selected'}
          </Text>
          <Text style={styles.chevron}>{isDeviceDropdownOpen ? '^' : 'v'}</Text>
        </Pressable>
        {isDeviceDropdownOpen ? (
          <View style={styles.dropdownList}>
            {devices.length === 0 ? (
              <Text style={styles.emptyDropdown}>Scan first to load real Bluetooth devices.</Text>
            ) : (
              devices.map((device) => (
                <Pressable
                  accessibilityRole="button"
                  key={device.id}
                  onPress={() => void handleSelectDevice(device)}
                  style={[styles.deviceOption, selectedDevice?.id === device.id && styles.selectedDeviceOption]}
                >
                  <View style={styles.deviceOptionHeader}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Text style={device.protocol === 'wifi' ? styles.wifiPill : styles.bluetoothPill}>
                      {device.protocol === 'wifi' ? 'WiFi' : 'Bluetooth'}
                    </Text>
                  </View>
                  <Text style={styles.deviceMeta}>{getDeviceDescription(device)}</Text>
                </Pressable>
              ))
            )}
          </View>
        ) : null}
        {selectedDevice ? (
          <View style={styles.selectedSummary}>
            <Text style={styles.selectedSummaryTitle}>Selected device</Text>
            <Text style={styles.savedText}>{getDeviceLabel(selectedDevice)}</Text>
            <Text style={styles.savedText}>{getDeviceDescription(selectedDevice)}</Text>
          </View>
        ) : null}
        <StatusMessage tone={deviceMessage.startsWith('No') ? 'error' : 'success'} message={deviceMessage} />
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
  bluetoothPill: {
    backgroundColor: '#f0eefe',
    borderRadius: 999,
    color: '#4d3f91',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chevron: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  deviceMeta: {
    color: colors.muted,
    lineHeight: 20,
  },
  deviceName: {
    color: colors.text,
    flex: 1,
    fontWeight: '900',
  },
  deviceOption: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  deviceOptionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dropdownButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 14,
  },
  dropdownList: {
    gap: spacing.sm,
  },
  dropdownText: {
    color: colors.text,
    flex: 1,
    fontWeight: '800',
  },
  emptyDropdown: {
    color: colors.muted,
    fontWeight: '700',
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
  placeholderText: {
    color: colors.muted,
    flex: 1,
    fontWeight: '700',
  },
  selectedDeviceOption: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  selectedSummary: {
    backgroundColor: colors.successBg,
    borderRadius: 8,
    gap: spacing.xs,
    padding: spacing.md,
  },
  selectedSummaryTitle: {
    color: colors.success,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 4,
  },
  wifiPill: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});

