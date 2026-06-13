import { BleClient, ScanMode } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';
import type { BluetoothDevice } from '../types';

const SCAN_DURATION_MS = 5000;

type WebBluetoothDevice = {
  id?: string;
  name?: string;
};

type WebBluetoothApi = {
  requestDevice?: (options: { acceptAllDevices: boolean; optionalServices?: string[] }) => Promise<WebBluetoothDevice>;
};

async function pickWebBluetoothDevice(): Promise<BluetoothDevice[]> {
  if (!('bluetooth' in navigator)) {
    throw new Error('Bluetooth scanning is only available on Android/iOS builds or browsers with Web Bluetooth support.');
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

export async function scanForBluetoothDevices(): Promise<BluetoothDevice[]> {
  if (Capacitor.getPlatform() === 'web') {
    return pickWebBluetoothDevice();
  }

  const devices = new Map<string, BluetoothDevice>();

  await BleClient.initialize({ androidNeverForLocation: true });

  const enabled = await BleClient.isEnabled();
  if (!enabled) {
    try {
      await BleClient.requestEnable();
    } catch {
      throw new Error('Bluetooth is disabled. Please enable Bluetooth and try again.');
    }
  }

  await BleClient.requestLEScan(
    {
      allowDuplicates: false,
      scanMode: ScanMode.SCAN_MODE_LOW_LATENCY,
    },
    (result) => {
      const name = result.localName || result.device.name || 'Unnamed Bluetooth device';
      devices.set(result.device.deviceId, {
        deviceId: result.device.deviceId,
        name,
        rssi: result.rssi,
      });
    },
  );

  await new Promise((resolve) => window.setTimeout(resolve, SCAN_DURATION_MS));
  await BleClient.stopLEScan();

  return Array.from(devices.values()).sort((a, b) => a.name.localeCompare(b.name));
}
