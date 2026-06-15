import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, type BleManager as BleManagerType } from 'react-native-ble-plx';
import type { DeviceOption } from '../types';

export type DeviceScanResult = {
  devices: DeviceOption[];
  note: string;
};

const BLUETOOTH_SCAN_MS = 7000;

export async function scanForNetworkDevices(): Promise<DeviceScanResult> {
  return scanForBluetoothDevices();
}

export function getDeviceLabel(device: DeviceOption) {
  const protocol = device.protocol === 'wifi' ? 'WiFi' : 'Bluetooth';
  return `${device.name} (${protocol})`;
}

export function getDeviceDescription(device: DeviceOption) {
  const details = [
    device.protocol === 'wifi' ? 'Network printer' : 'Bluetooth printer',
    device.address,
    device.signalStrength ? `${device.signalStrength}% signal` : null,
    device.isPaired === true ? 'paired' : null,
    device.isReachable === false ? 'not reachable' : 'reachable',
  ].filter(Boolean);

  return details.join(' - ');
}

async function scanForBluetoothDevices(): Promise<DeviceScanResult> {
  try {
    const hasPermission = await requestBluetoothPermissions();

    if (!hasPermission) {
      return {
        devices: [],
        note: 'Bluetooth permission was not granted.',
      };
    }

    const manager = new BleManager();
    const discoveredDevices = new Map<string, DeviceOption>();

    await waitForBluetoothPoweredOn(manager);

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        manager.stopDeviceScan();
        resolve();
      }, BLUETOOTH_SCAN_MS);

      manager.startDeviceScan(null, { allowDuplicates: false }, (error, scannedDevice) => {
        if (error) {
          clearTimeout(timeout);
          manager.stopDeviceScan();
          resolve();
          return;
        }

        if (!scannedDevice) {
          return;
        }

        const name = scannedDevice.name ?? scannedDevice.localName ?? 'Unknown Bluetooth Device';

        discoveredDevices.set(scannedDevice.id, {
          address: scannedDevice.id,
          id: scannedDevice.id,
          isReachable: true,
          name,
          protocol: 'bluetooth',
          signalStrength: convertRssiToSignal(scannedDevice.rssi),
        });
      });
    });

    manager.destroy();

    const devices = Array.from(discoveredDevices.values());

    return {
      devices,
      note:
        devices.length === 0
          ? 'Real Bluetooth scan finished, but no nearby BLE devices were found.'
          : 'Real Bluetooth scan finished. Select a discovered Bluetooth device.',
    };
  } catch {
    return {
      devices: [],
      note:
        'Real Bluetooth scanning needs a development build with native BLE support. No mock devices are shown.',
    };
  }
}

async function requestBluetoothPermissions() {
  if (Platform.OS !== 'android') {
    return true;
  }

  const androidVersion = typeof Platform.Version === 'number' ? Platform.Version : Number.parseInt(String(Platform.Version), 10);

  const permissions =
    androidVersion >= 31
      ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]
      : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

  const results = await PermissionsAndroid.requestMultiple(permissions);

  return permissions.every((permission) => results[permission] === PermissionsAndroid.RESULTS.GRANTED);
}

async function waitForBluetoothPoweredOn(manager: BleManagerType) {
  const currentState = await manager.state();

  if (currentState === 'PoweredOn') {
    return;
  }

  await new Promise<void>((resolve) => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        subscription.remove();
        resolve();
      }
    }, true);

    setTimeout(() => {
      subscription.remove();
      resolve();
    }, 2500);
  });
}

function convertRssiToSignal(rssi: number | null) {
  if (typeof rssi !== 'number') {
    return undefined;
  }

  return Math.max(1, Math.min(100, 2 * (rssi + 100)));
}

