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
      const fallback = 'https://fairfetch.onrender.com';
      console.warn(`Missing NEXT_PUBLIC_API_BASE_URL. Falling back to ${fallback}.`);
      logBaseUrl(fallback);
      return fallback;
    }

    return 'https://fairfetch.onrender.com';
  }
  const normalized = value.replace(/\/+$/, '');
  logBaseUrl(normalized);
  return normalized;
};

export const API_BASE_URL = resolveBaseUrl();
