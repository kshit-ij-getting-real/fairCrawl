'use client';

import {
  demoContentControls,
  demoLicenseSettings,
  demoPricingRules,
  demoPublisherDomains,
  demoPublisherOverview,
  demoTransactions,
} from './demoData';

const KEY_PREFIX = 'fairfetch.publisher.mock';

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(`${KEY_PREFIX}.${key}`);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`${KEY_PREFIX}.${key}`, JSON.stringify(value));
};

export const publisherMockStore = {
  getDomains: () => read('domains', demoPublisherDomains),
  setDomains: (domains: unknown) => write('domains', domains),

  getPricingRules: () => read('pricingRules', demoPricingRules),
  setPricingRules: (rules: unknown) => write('pricingRules', rules),

  getLicenseSettings: () => read('licenseSettings', demoLicenseSettings),
  setLicenseSettings: (settings: unknown) => write('licenseSettings', settings),

  getContentControls: () => read('contentControls', demoContentControls),
  setContentControls: (controls: unknown) => write('contentControls', controls),

  getTransactions: () => read('transactions', demoTransactions),

  getOverview: () => read('overview', demoPublisherOverview),
};
