import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        faircrawl: {
          bgDark: '#020617',
          heroFrom: '#050922',
          heroTo: '#0c1f4f',
          surface: '#0b1120',
          accent: '#2563eb',
          accentSoft: '#3b82f6',
          textMain: '#25306d',
          textMuted: '#7b82a8',
        },
      },
    },
  },
  plugins: [],
};

export default config;
