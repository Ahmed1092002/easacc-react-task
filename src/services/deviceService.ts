import type { DeviceOption } from '../types';

export type DeviceScanResult = {
  devices: DeviceOption[];
  note: string;
};

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
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    devices: mockNetworkPrinters,
    note:
      'Demo scan loaded WiFi and Bluetooth printers. Real discovery needs native modules, permissions, and a development build.',
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
