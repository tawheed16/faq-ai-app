import { FaqEntry } from './faq-validation';

type SearchResult = {
  best: FaqEntry | null;
  related: FaqEntry[];
  lowConfidence: boolean;
  bestScore: number;
};

const DEFAULT_LOW_CONFIDENCE_THRESHOLD = 2;
const TOP_RELATED_COUNT = 3;

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreFaq(queryTokens: string[], faq: FaqEntry) {
  const questionText = faq.question.toLowerCase();
  const tagText = faq.tags.join(' ').toLowerCase();
  const keywordText = (faq.keywords || []).join(' ').toLowerCase();

  return queryTokens.reduce((score, token) => {
    let tokenScore = 0;

    if (questionText.includes(token)) tokenScore += 3;
    if (tagText.includes(token)) tokenScore += 2;
    if (keywordText.includes(token)) tokenScore += 1;

    return score + tokenScore;
  }, 0);
}

export function searchFaqs(query: string, faqs: FaqEntry[]): SearchResult {
  const tokens = normalizeText(query);
  if (tokens.length === 0) {
    return { best: null, related: [], lowConfidence: true, bestScore: 0 };
  }

  const scored = faqs.map((faq) => ({ faq, score: scoreFaq(tokens, faq) }));
  const sorted = scored.sort((a, b) => b.score - a.score);

  const best = sorted[0];
  const bestMatch = best?.score > 0 ? best.faq : null;
  const bestScore = best?.score ?? 0;
  const lowConfidence = bestScore < DEFAULT_LOW_CONFIDENCE_THRESHOLD;

  const related = sorted
    .filter((item) => item.faq.id !== bestMatch?.id && item.score > 0)
    .slice(0, TOP_RELATED_COUNT)
    .map((item) => item.faq);

  return {
    best: bestMatch,
    related,
    lowConfidence,
    bestScore,
  };
}

export type { SearchResult };
