import { createHash } from 'node:crypto';
import {
  hasValidPilotAuthorization,
  PILOT_ANSWER,
  PILOT_DOCUMENT,
  PILOT_ECONOMICS,
} from '@/lib/pilotTransaction';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!hasValidPilotAuthorization(request)) {
    return Response.json({ error: 'INVALID_API_KEY' }, { status: 401 });
  }

  const idempotencyKey = request.headers.get('idempotency-key')?.trim();
  if (!idempotencyKey || idempotencyKey.length > 120) {
    return Response.json(
      {
        error: 'INVALID_IDEMPOTENCY_KEY',
        message: 'Provide an Idempotency-Key header containing at most 120 characters.',
      },
      { status: 400 },
    );
  }

  let body: { document_id?: unknown; question?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  if (body.document_id !== PILOT_DOCUMENT.id) {
    return Response.json({ error: 'DOCUMENT_NOT_FOUND' }, { status: 404 });
  }

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (question.length < 8 || question.length > 800) {
    return Response.json(
      {
        error: 'INVALID_QUESTION',
        message: 'question must contain between 8 and 800 characters.',
      },
      { status: 400 },
    );
  }

  const transactionId = `ff_tx_${createHash('sha256').update(idempotencyKey).digest('hex').slice(0, 12)}`;
  const responseHash = createHash('sha256').update(PILOT_ANSWER.summary).digest('hex');

  return Response.json(
    {
      transaction_id: transactionId,
      status: 'COMPLETED',
      request_type: 'ANSWER',
      answer: PILOT_ANSWER.summary,
      findings: PILOT_ANSWER.findings,
      citation: {
        document_id: PILOT_ANSWER.citation.documentId,
        title: PILOT_ANSWER.citation.title,
        publisher: PILOT_ANSWER.citation.publisher,
        page: PILOT_ANSWER.citation.page,
        section: PILOT_ANSWER.citation.section,
      },
      license: {
        status: PILOT_DOCUMENT.license.status,
        access_mode: PILOT_DOCUMENT.accessMode,
        maximum_quote_characters: PILOT_DOCUMENT.license.maximumQuoteCharacters,
        retention_days: PILOT_DOCUMENT.license.retentionDays,
      },
      metering: {
        credits_before: PILOT_ECONOMICS.startingCredits,
        credits_charged: PILOT_ECONOMICS.creditsCharged,
        credits_remaining: PILOT_ECONOMICS.creditsRemaining,
      },
      settlement: {
        publisher_gross_credits: PILOT_ECONOMICS.publisherGrossCredits,
        platform_fee_credits: PILOT_ECONOMICS.platformFeeCredits,
        publisher_net_credits: PILOT_ECONOMICS.publisherNetCredits,
      },
      controls: {
        raw_source_exposed: false,
        response_hash: responseHash,
        idempotency_key: idempotencyKey,
        pilot_ledger: 'EPHEMERAL',
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'X-FairFetch-Transaction-Id': transactionId,
        'X-FairFetch-Pilot': 'illustrative-content',
      },
    },
  );
}

