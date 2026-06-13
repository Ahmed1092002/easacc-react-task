export async function openUrlInApp(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export async function openUrlInSystemBrowser(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
