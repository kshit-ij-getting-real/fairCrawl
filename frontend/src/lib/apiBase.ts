let hasLogged = false;

const logBaseUrl = (baseUrl: string) => {
  if (process.env.NODE_ENV !== 'production' && !hasLogged) {
    console.log(`API base URL: ${baseUrl}`);
    hasLogged = true;
  }
};

const resolveBaseUrl = () => {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!value) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
  const normalized = value.trim().replace(/\/+$/, '');
  logBaseUrl(normalized);
  return normalized;
};

export const API_BASE_URL = resolveBaseUrl();
