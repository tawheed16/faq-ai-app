import faqs from '../data/faqs.json';
import { searchFaqs } from './faq-search';
import { validateAndNormalizeFaqs } from './faq-validation';
import type { FaqEntry, SearchResult } from './types';
import type { ValidationResult } from './faq-validation';

let cachedFaqEntries: FaqEntry[] | null = null;

function loadFaqEntries(): FaqEntry[] {
  if (cachedFaqEntries) {
    return cachedFaqEntries;
  }

  const result: ValidationResult = validateAndNormalizeFaqs(faqs as unknown);
  if (!result.valid) {
    throw new Error(`FAQ data validation failed: ${result.errors.join('; ')}`);
  }

  cachedFaqEntries = result.data;
  return cachedFaqEntries;
}

export function validateFaqData(): ValidationResult {
  return validateAndNormalizeFaqs(faqs as unknown);
}

export function searchFaqQuery(query: string): SearchResult {
  const entries = loadFaqEntries();
  return searchFaqs(query, entries);
}
