import { NextResponse } from 'next/server';

import faqs from '../../../../data/faqs.json';

type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  keywords?: string[];
};

type SearchPayload = {
  query: string;
};

type SearchResult = {
  best: FaqEntry | null;
  related: FaqEntry[];
  lowConfidence: boolean;
};

const MIN_CONFIDENCE_SCORE = 2;
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

export async function POST(request: Request) {
  const body: SearchPayload = await request.json();
  const query = (body.query || '').trim();
  const tokens = normalizeText(query);

  if (!query || tokens.length === 0) {
    return NextResponse.json<SearchResult>({
      best: null,
      related: [],
      lowConfidence: true,
    });
  }

  const scoredFaqs = faqs
    .map((faq) => ({ faq, score: scoreFaq(tokens, faq) }))
    .sort((a, b) => b.score - a.score);

  const bestMatch = scoredFaqs[0];
  const matchedBest = bestMatch?.score > 0 ? bestMatch.faq : null;
  const lowConfidence = bestMatch ? bestMatch.score < MIN_CONFIDENCE_SCORE : true;

  const related = scoredFaqs
    .filter((item) => item.faq.id !== matchedBest?.id && item.score > 0)
    .slice(0, TOP_RELATED_COUNT)
    .map((item) => item.faq);

  return NextResponse.json<SearchResult>({
    best: matchedBest,
    related,
    lowConfidence,
  });
}
