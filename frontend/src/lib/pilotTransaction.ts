export const PILOT_API_KEY = 'ff_demo_aster_2026';

export const PILOT_DOCUMENT = {
  id: 'doc_iex_2026',
  title: 'India Power Exchanges: Regulation, Market Coupling and the IEX Moat',
  publisher: 'GridLine Research (illustrative)',
  description: 'Specialist analysis of Indian power-market structure, market coupling, and IEX earnings sensitivity.',
  publishedAt: '2026-07-24',
  category: 'Energy market intelligence',
  creditCost: 5,
  accessMode: 'ANSWER',
  license: {
    status: 'ACTIVE',
    ownershipAttested: true,
    agentDistributionAllowed: true,
    commercialUseAllowed: true,
    quotationAllowed: true,
    maximumQuoteCharacters: 600,
    retentionDays: 30,
  },
  privateFile: {
    status: 'PRIVATE',
    fileHash: 'sha256:92d7…8f41',
    rawSourceExposed: false,
  },
} as const;

export const PILOT_QUERY =
  'What could change the earnings power and market position of Indian Energy Exchange over the next 12 months?';

export const PILOT_ANSWER = {
  summary:
    'IEX’s earnings power remains supported by electricity-market volume growth and operating leverage, but its market position is most sensitive to the implementation of market coupling. The base case is resilient margins as new-product volumes scale; the downside case is lower pricing power if coupling reduces exchange differentiation.',
  findings: [
    {
      label: 'Base case',
      value: 'Double-digit market-volume growth offsets modest pressure on transaction fees.',
    },
    {
      label: 'Key risk',
      value: 'Faster market-coupling implementation reduces IEX’s liquidity advantage.',
    },
    {
      label: 'Watch next',
      value: 'CERC implementation timing, day-ahead market share, and new-product volumes.',
    },
  ],
  citation: {
    documentId: PILOT_DOCUMENT.id,
    title: PILOT_DOCUMENT.title,
    publisher: PILOT_DOCUMENT.publisher,
    page: 14,
    section: 'Market coupling scenarios',
  },
} as const;

export const PILOT_ECONOMICS = {
  startingCredits: 100,
  creditsCharged: PILOT_DOCUMENT.creditCost,
  creditsRemaining: 95,
  publisherGrossCredits: 5,
  platformFeeCredits: 1,
  publisherNetCredits: 4,
} as const;

export function hasValidPilotAuthorization(request: Request) {
  return request.headers.get('authorization') === `Bearer ${PILOT_API_KEY}`;
}

