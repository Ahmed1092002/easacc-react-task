export async function isOnline(): Promise<boolean> {
  return navigator.onLine;
}
