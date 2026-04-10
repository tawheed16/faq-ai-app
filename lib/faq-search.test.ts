import { describe, expect, it } from 'vitest';
import { searchFaqs } from './faq-search';
import type { FaqEntry } from './faq-validation';

describe('searchFaqs', () => {
  const faqs: FaqEntry[] = [
    {
      id: 'faq-1',
      question: 'Can international students work full time during scheduled breaks?',
      answer: 'Yes, eligible international students can work full time during scheduled breaks.',
      tags: ['work', 'permits'],
      keywords: ['full time', 'breaks', 'international'],
    },
    {
      id: 'faq-2',
      question: 'How do I apply for a study permit extension?',
      answer: 'Submit your extension through the IRCC portal before your permit expires.',
      tags: ['study permit', 'extension'],
      keywords: ['extension', 'IRCC'],
    },
    {
      id: 'faq-3',
      question: 'Where can I find my SIN number?',
      answer: 'Your SIN is issued by Service Canada and can be found on official documentation.',
      tags: ['SIN', 'tax'],
      keywords: ['SIN', 'social insurance'],
    },
    {
      id: 'faq-4',
      question: 'How do I contact support?',
      answer: 'Use the student portal chat widget or email support.',
      tags: ['support'],
      keywords: ['help', 'contact'],
    },
  ];

  it('returns the correct best FAQ match for a relevant natural-language query', () => {
    const result = searchFaqs('Can I work full-time during break?', faqs);

    expect(result.best).not.toBeNull();
    expect(result.best?.id).toBe('faq-1');
    expect(result.lowConfidence).toBe(false);
    expect(result.bestScore).toBeGreaterThan(0);
  });

  it('returns related matches in a sensible order', () => {
    const result = searchFaqs('study permit extension process', faqs);

    expect(result.best).not.toBeNull();
    expect(result.best?.id).toBe('faq-2');
    expect(result.related.length).toBeGreaterThanOrEqual(1);
    expect(result.related[0].id).not.toBe(result.best?.id);
    expect(result.related.map((item) => item.id)).toEqual(
      [...new Set(result.related.map((item) => item.id))]
    );
  });

  it('returns lowConfidence=true for weak or unrelated queries', () => {
    const result = searchFaqs('What color is the sky?', faqs);

    expect(result.best).toBeNull();
    expect(result.lowConfidence).toBe(true);
    expect(result.bestScore).toBe(0);
  });
});
