export function normalizeUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error('Please enter a website URL.');
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(withProtocol);

  if (!parsed.hostname.includes('.')) {
    throw new Error('Please enter a valid website address.');
  }

  return parsed.toString();
}
