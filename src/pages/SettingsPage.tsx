import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModeBadge from '../components/AuthModeBadge';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import StatusMessage from '../components/StatusMessage';
import { scanForBluetoothDevices } from '../services/bluetooth';
import { normalizeUrl } from '../services/url';
import { useApp } from '../state/AppContext';
import type { BluetoothDevice } from '../types';

export default function SettingsPage() {
  const { authMode, currentUser, selectedDevice, setSelectedDevice, setWebUrl, signOut, webUrl } = useApp();
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState(webUrl);
  const [devices, setDevices] = useState<BluetoothDevice[]>(selectedDevice ? [selectedDevice] : []);
  const [isScanning, setIsScanning] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [deviceError, setDeviceError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setUrlInput(webUrl);
  }, [webUrl]);

  async function handleSaveUrl() {
    setUrlError('');
    setSavedMessage('');

    try {
      const normalized = normalizeUrl(urlInput);
      await setWebUrl(normalized);
      setUrlInput(normalized);
      setSavedMessage('URL saved successfully.');
    } catch (error) {
      setUrlError(error instanceof Error ? error.message : 'Please enter a valid URL.');
    }
  }

  async function handleScan() {
    setDeviceError('');
    setIsScanning(true);

    try {
      const results = await scanForBluetoothDevices();
      setDevices(results);
      if (results.length === 0) {
        setDeviceError('No nearby Bluetooth devices found.');
      }
    } catch (error) {
      setDeviceError(error instanceof Error ? error.message : 'Bluetooth scan failed.');
    } finally {
      setIsScanning(false);
    }
  }

  async function handleDeviceChange(deviceId: string) {
    const device = devices.find((item) => item.deviceId === deviceId) ?? null;
    await setSelectedDevice(device);
  }

  return (
    <main className="screen with-nav">
      <PageHeader
        eyebrow="Settings"
        title="App Configuration"
        action={
          <button type="button" className="text-button" onClick={() => void signOut()}>
            Sign out
          </button>
        }
      />

      <SectionCard title="Website URL" description="This URL will open on the Web View page.">
        <label className="field-label" htmlFor="webUrl">
          Web URL
        </label>
        <input
          id="webUrl"
          inputMode="url"
          placeholder="https://example.com"
          value={urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
        />
        <div className="action-row">
          <button type="button" onClick={() => void handleSaveUrl()}>
            Save URL
          </button>
          <button type="button" className="secondary-button" disabled={!webUrl} onClick={() => navigate('/webview')}>
            Open Web View
          </button>
        </div>
        <StatusMessage tone="error">{urlError}</StatusMessage>
        <StatusMessage tone="success">{savedMessage}</StatusMessage>
        {webUrl ? <p className="saved-url">Saved: {webUrl}</p> : null}
      </SectionCard>

      <SectionCard title="Authentication" description="Demo mode works without external provider credentials.">
        <AuthModeBadge authMode={authMode} label="Current mode" />
        {currentUser ? <p className="saved-url">Signed in as {currentUser.email}</p> : null}
      </SectionCard>

      <SectionCard title="Bluetooth Device" description="Scan nearby Bluetooth LE devices and choose one from the dropdown.">
        <button type="button" className="secondary-button" onClick={() => void handleScan()} disabled={isScanning}>
          {isScanning ? 'Scanning...' : 'Scan devices'}
        </button>
        <label className="field-label" htmlFor="device">
          Device list
        </label>
        <select
          id="device"
          value={selectedDevice?.deviceId ?? ''}
          onChange={(event) => void handleDeviceChange(event.target.value)}
        >
          <option value="">No device selected</option>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.name} {device.rssi ? `(${device.rssi} dBm)` : ''}
            </option>
          ))}
        </select>
        <StatusMessage tone="error">{deviceError}</StatusMessage>
        {selectedDevice ? <p className="saved-url">Selected: {selectedDevice.name}</p> : null}
      </SectionCard>
    </main>
  );
}
