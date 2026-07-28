import { createHash } from 'node:crypto';
import { hasValidPilotAuthorization, PILOT_DOCUMENT } from '@/lib/pilotTransaction';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!hasValidPilotAuthorization(request)) {
    return Response.json(
      {
        error: 'INVALID_API_KEY',
        message: 'Use the public pilot API key shown in the FairFetch transaction room.',
      },
      { status: 401 },
    );
  }

  let body: { query?: unknown; limit?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const query = typeof body.query === 'string' ? body.query.trim() : '';
  if (query.length < 8 || query.length > 800) {
    return Response.json(
      {
        error: 'INVALID_QUERY',
        message: 'query must contain between 8 and 800 characters.',
      },
      { status: 400 },
    );
  }

  const requestId = `search_${createHash('sha256').update(query).digest('hex').slice(0, 10)}`;

  return Response.json(
    {
      request_id: requestId,
      results: [
        {
          document_id: PILOT_DOCUMENT.id,
          title: PILOT_DOCUMENT.title,
          publisher: PILOT_DOCUMENT.publisher,
          description: PILOT_DOCUMENT.description,
          relevance_score: 0.96,
          credit_cost: PILOT_DOCUMENT.creditCost,
          access_modes: [PILOT_DOCUMENT.accessMode.toLowerCase()],
          license_status: PILOT_DOCUMENT.license.status,
          raw_source_exposed: false,
        },
      ],
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'X-FairFetch-Pilot': 'illustrative-content',
      },
    },
  );
}

