import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import HomePage from './page';

describe('HomePage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a successful result after submitting a query', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: async () => ({
          best: {
            id: 'faq-1',
            question: 'Can I work full time during break?',
            answer: 'Yes, eligible international students can work full-time during scheduled breaks.',
            tags: ['work', 'breaks'],
          },
          related: [
            {
              id: 'faq-2',
              question: 'How do I apply for a study permit extension?',
              answer: 'Submit your extension through the IRCC portal.',
              tags: ['study permit'],
            },
          ],
          lowConfidence: false,
          bestScore: 6,
        }),
      } as Response)
    );

    render(<HomePage />);

    const input = screen.getByLabelText(/what do you want to know/i);
    fireEvent.change(input, { target: { value: 'Can I work during break?' } });

    const button = screen.getByRole('button', { name: /search faq/i });
    fireEvent.click(button);

    expect(await screen.findByText(/best match/i)).toBeInTheDocument();
    expect(screen.getByText(/can i work full time during break\?/i)).toBeInTheDocument();
    expect(screen.getByText(/yes, eligible international students can work full-time during scheduled breaks\./i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /related questions/i })).toBeInTheDocument();
    expect(screen.queryByText(/confidence is low/i)).not.toBeInTheDocument();
  });

  it('shows an error state when the API returns a failure', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Query must not be empty.' }),
      } as Response)
    );

    render(<HomePage />);

    const input = screen.getByLabelText(/what do you want to know/i);
    fireEvent.change(input, { target: { value: 'Can I work during break?' } });

    const button = screen.getByRole('button', { name: /search faq/i });
    fireEvent.click(button);

    expect(await screen.findByText(/search request failed\./i)).toBeInTheDocument();
  });

  it('shows a low-confidence note when the API response indicates lowConfidence', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: async () => ({
          best: {
            id: 'faq-1',
            question: 'Can I work part time while studying?',
            answer: 'Yes, eligible students can work part time during study periods.',
            tags: ['work'],
          },
          related: [],
          lowConfidence: true,
          bestScore: 1,
        }),
      } as Response)
    );

    render(<HomePage />);

    const input = screen.getByLabelText(/what do you want to know/i);
    fireEvent.change(input, { target: { value: 'Can I work while studying?' } });

    const button = screen.getByRole('button', { name: /search faq/i });
    fireEvent.click(button);

    expect(await screen.findByText(/this answer is the best match, but confidence is low\./i)).toBeInTheDocument();
  });
});
