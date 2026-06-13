import type { BluetoothDevice } from '../types';

type WebBluetoothDevice = {
  id?: string;
  name?: string;
};

type WebBluetoothApi = {
  requestDevice?: (options: { acceptAllDevices: boolean; optionalServices?: string[] }) => Promise<WebBluetoothDevice>;
};

export async function scanForBluetoothDevices(): Promise<BluetoothDevice[]> {
  if (!('bluetooth' in navigator)) {
    throw new Error('Bluetooth scanning requires a browser with Web Bluetooth support.');
  }

  const bluetooth = (navigator as Navigator & { bluetooth?: WebBluetoothApi }).bluetooth;

  if (!bluetooth?.requestDevice) {
    throw new Error('This browser does not support Bluetooth device selection. Test scanning on the Android or iOS app build.');
  }

  const device = await bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [],
  });

  return [
    {
      deviceId: device.id ?? device.name ?? 'web-bluetooth-device',
      name: device.name ?? 'Unnamed Bluetooth device',
    },
  ];
}
