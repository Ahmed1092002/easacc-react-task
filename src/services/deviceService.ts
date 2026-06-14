import { PermissionsAndroid, Platform } from 'react-native';
import type { DeviceOption } from '../types';

export type DeviceScanResult = {
  devices: DeviceOption[];
  note: string;
};

const BLUETOOTH_SCAN_MS = 7000;

const mockNetworkPrinters: DeviceOption[] = [
  {
    address: '192.168.1.45',
    id: 'wifi-epson-office-01',
    isReachable: true,
    name: 'Epson Office WiFi Printer',
    protocol: 'wifi',
    signalStrength: 88,
  },
  {
    address: 'BT:58:9A:22:10:7F',
    id: 'bt-receipt-front-desk',
    isPaired: true,
    isReachable: true,
    name: 'Front Desk Bluetooth Receipt Printer',
    protocol: 'bluetooth',
    signalStrength: 74,
  },
  {
    address: '192.168.1.62',
    id: 'wifi-zebra-label-02',
    isReachable: true,
    name: 'Zebra WiFi Label Printer',
    protocol: 'wifi',
    signalStrength: 67,
  },
  {
    address: 'BT:41:0C:EF:88:31',
    id: 'bt-portable-printer-03',
    isPaired: false,
    isReachable: false,
    name: 'Portable Bluetooth Printer',
    protocol: 'bluetooth',
    signalStrength: 39,
  },
];

export async function scanForNetworkDevices(): Promise<DeviceScanResult> {
  const bluetoothScan = await scanForBluetoothDevices();

  if (bluetoothScan.devices.length > 0) {
    return {
      devices: [...mockNetworkPrinters.filter((device) => device.protocol === 'wifi'), ...bluetoothScan.devices],
      note: bluetoothScan.note,
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    devices: mockNetworkPrinters,
    note: `${bluetoothScan.note} Demo WiFi and Bluetooth printers are shown as fallback.`,
  };
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

    const { BleManager } = await import('react-native-ble-plx');
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
          : 'Real Bluetooth scan finished. Select a discovered Bluetooth device or a WiFi printer.',
    };
  } catch {
    return {
      devices: [],
      note:
        'Real Bluetooth scanning needs a development build with native BLE support. Expo Go cannot run this native module.',
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

async function waitForBluetoothPoweredOn(manager: import('react-native-ble-plx').BleManager) {
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
