import { Network } from '@capacitor/network';

export async function isOnline(): Promise<boolean> {
  const status = await Network.getStatus();
  return status.connected;
}
