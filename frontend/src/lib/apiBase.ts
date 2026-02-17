let hasLogged = false;

const logBaseUrl = (baseUrl: string) => {
  if (process.env.NODE_ENV !== 'production' && !hasLogged) {
    console.log(`API base URL: ${baseUrl}`);
    hasLogged = true;
  }
};

const resolveBaseUrl = () => {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!value) {
    if (typeof window !== 'undefined') {
      console.warn('Missing NEXT_PUBLIC_API_BASE_URL. API requests will fail until this environment variable is set.');
      return '';
    }

    return 'http://localhost:4000';
  }
  const normalized = value.replace(/\/+$/, '');
  logBaseUrl(normalized);
  return normalized;
};

export const API_BASE_URL = resolveBaseUrl();
