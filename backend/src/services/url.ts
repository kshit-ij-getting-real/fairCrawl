export const canonicalizeUrl = (input: string) => {
  const parsed = new URL(input);
  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname || '/';
  const sorted = [...parsed.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
  const query = new URLSearchParams(sorted).toString();
  const full = `${parsed.protocol}//${host}${path}${query ? `?${query}` : ''}`;
  return { host, path, full };
};
