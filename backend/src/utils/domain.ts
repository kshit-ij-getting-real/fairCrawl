export const normalizeDomainInput = (value: string) => {
  const raw = value.trim().toLowerCase();
  if (!raw) return '';
  const withScheme = raw.includes('://') ? raw : `https://${raw}`;
  try {
    return new URL(withScheme).hostname.replace(/\.$/, '');
  } catch {
    return raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/\.$/, '');
  }
};
