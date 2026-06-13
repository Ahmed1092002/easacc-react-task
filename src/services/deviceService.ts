import type { DeviceOption } from '../types';

const mockDevices: DeviceOption[] = [
  { id: 'mock-printer-01', name: 'Office Printer' },
  { id: 'mock-bluetooth-02', name: 'Bluetooth Receipt Printer' },
  { id: 'mock-wifi-03', name: 'WiFi Label Printer' },
];

export async function scanForDevices(): Promise<DeviceOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Real BLE would be added later with react-native-ble-plx.
  // That requires native permissions and usually a development build.
  return mockDevices;
}
