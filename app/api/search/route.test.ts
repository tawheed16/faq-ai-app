import { describe, expect, it } from 'vitest';
import { POST } from './route';

describe('app/api/search/route', () => {
  it('returns structured search results for a valid query', async () => {
    const request = new Request('http://localhost/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Can I work full time during break?' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(payload).toHaveProperty('best');
    expect(payload).toHaveProperty('related');
    expect(payload).toHaveProperty('lowConfidence');
    expect(payload).toHaveProperty('bestScore');
    expect(Array.isArray(payload.related)).toBe(true);
  });

  it('rejects an empty query safely', async () => {
    const request = new Request('http://localhost/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '   ' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload).toHaveProperty('error');
    expect(payload.error).toMatch(/query/i);
  });

  it('rejects invalid request bodies safely', async () => {
    const request = new Request('http://localhost/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wrongField: 'test' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload).toHaveProperty('error');
    expect(payload.error).toMatch(/query/i);
  });
});
