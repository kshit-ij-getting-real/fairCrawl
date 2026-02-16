import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

export type ErrorCode =
  | 'INVALID_API_KEY'
  | 'INVALID_TOKEN'
  | 'UNPRICED'
  | 'MAX_PRICE_EXCEEDED'
  | 'FILTERED'
  | 'TOKEN_ALREADY_SPENT';

export class FairFetchError extends Error {
  constructor(
    public status: number,
    public code: ErrorCode,
    message: string,
    public help: string
  ) {
    super(message);
  }
}

export const ensureRequestId = (req: Request) => {
  const existing = req.header('x-request-id');
  return existing || randomUUID();
};

export const sendError = (res: Response, requestId: string, error: FairFetchError) => {
  res.status(error.status).json({ code: error.code, message: error.message, request_id: requestId, help: error.help });
};
