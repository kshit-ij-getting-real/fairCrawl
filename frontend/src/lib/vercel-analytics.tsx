'use client';

import Script from 'next/script';

export function Analytics() {
  return <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />;
}
