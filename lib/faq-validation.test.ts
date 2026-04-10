import { describe, expect, it } from 'vitest';
import { validateAndNormalizeFaqs } from './faq-validation';

describe('validateAndNormalizeFaqs', () => {
  it('accepts valid FAQ data and normalizes strings, tags, and keywords', () => {
    const raw = [
      {
        id: ' faq-1 ',
        question: ' What is a study permit? ',
        answer: 'A study permit is a document that allows you to study in Canada. ',
        tags: [' Study ', ' Permit '],
        keywords: [' International ', ' student '],
      },
    ];

    const result = validateAndNormalizeFaqs(raw);

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data).toEqual([
        {
          id: 'faq-1',
          question: 'What is a study permit?',
          answer: 'A study permit is a document that allows you to study in Canada.',
          tags: ['study', 'permit'],
          keywords: ['international', 'student'],
        },
      ]);
    }
  });

  it('rejects FAQ entries with missing required fields', () => {
    const raw = [
      {
        id: 'faq-2',
        question: 'Can I work while studying?',
        // answer missing
        tags: ['employment'],
      },
    ];

    const result = validateAndNormalizeFaqs(raw);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain('FAQ entry 1 is missing a non-empty answer');
    }
  });

  it('rejects FAQ entries with empty question or answer', () => {
    const raw = [
      {
        id: 'faq-3',
        question: ' ',
        answer: '  ',
        tags: ['immigration'],
      },
    ];

    const result = validateAndNormalizeFaqs(raw);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain('FAQ entry 1 is missing a non-empty question');
      expect(result.errors).toContain('FAQ entry 1 is missing a non-empty answer');
    }
  });

  it('rejects FAQ entries when tags is not an array', () => {
    const raw = [
      {
        id: 'faq-4',
        question: 'How do I extend my study permit?',
        answer: 'Apply through the IRCC portal before expiry.',
        tags: 'study',
      },
    ];

    const result = validateAndNormalizeFaqs(raw);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain('FAQ entry 1 must include a non-empty array of tags');
    }
  });

  it('rejects invalid item shapes inside the FAQ data', () => {
    const raw = [
      'not an object',
      null,
    ];

    const result = validateAndNormalizeFaqs(raw);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain('FAQ entry 1 must be an object');
      expect(result.errors).toContain('FAQ entry 2 must be an object');
    }
  });

  it('rejects FAQ entries with invalid or missing id', () => {
    const raw = [
      {
        id: ' ',
        question: 'What is a SIN number?',
        answer: 'A SIN is a Canadian social insurance number.',
        tags: ['tax'],
      },
      {
        question: 'What is a study permit?',
        answer: 'A study permit is a document that allows you to study in Canada.',
        tags: ['permit'],
      },
    ];

    const result = validateAndNormalizeFaqs(raw);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain('FAQ entry 1 is missing a non-empty string id');
      expect(result.errors).toContain('FAQ entry 2 is missing a non-empty string id');
    }
  });
});
