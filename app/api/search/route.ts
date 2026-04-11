import { NextResponse } from 'next/server';

import faqs from '../../../data/faqs.json';
import { searchFaqs } from '../../../lib/faq-search';
import type { FaqEntry } from '../../../lib/types';

function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return createErrorResponse('Invalid JSON body.');
  }

  if (typeof body !== 'object' || body === null || !('query' in body)) {
    return createErrorResponse('Request body must include a query string.');
  }

  const queryValue = (body as { query?: unknown }).query;
  if (typeof queryValue !== 'string') {
    return createErrorResponse('Query must be a string.');
  }

  const query = queryValue.trim();
  if (!query) {
    return createErrorResponse('Query must not be empty.');
  }

  const result = searchFaqs(query, faqs as FaqEntry[]);
  return NextResponse.json(result);
}
