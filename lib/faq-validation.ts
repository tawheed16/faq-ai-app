export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  keywords?: string[];
};

export type ValidationResult =
  | { valid: true; data: FaqEntry[] }
  | { valid: false; errors: string[] };

function normalizeText(value: string) {
  return value.trim();
}

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

function normalizeKeywords(value: string) {
  return value.trim().toLowerCase();
}

function assertString(value: unknown): value is string {
  return typeof value === 'string';
}

function assertStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function validateAndNormalizeFaqs(raw: unknown): ValidationResult {
  if (!Array.isArray(raw)) {
    return { valid: false, errors: ['FAQ data must be an array'] };
  }

  const errors: string[] = [];
  const normalized: FaqEntry[] = [];

  raw.forEach((item, index) => {
    const prefix = `FAQ entry ${index + 1}`;
    if (typeof item !== 'object' || item === null) {
      errors.push(`${prefix} must be an object`);
      return;
    }

    const id = (item as { id?: unknown }).id;
    const question = (item as { question?: unknown }).question;
    const answer = (item as { answer?: unknown }).answer;
    const tags = (item as { tags?: unknown }).tags;
    const keywords = (item as { keywords?: unknown }).keywords;

    if (!assertString(id) || !id.trim()) {
      errors.push(`${prefix} is missing a non-empty string id`);
    }
    if (!assertString(question) || !question.trim()) {
      errors.push(`${prefix} is missing a non-empty question`);
    }
    if (!assertString(answer) || !answer.trim()) {
      errors.push(`${prefix} is missing a non-empty answer`);
    }
    if (!assertStringArray(tags) || tags.length === 0 || tags.some((tag) => !tag.trim())) {
      errors.push(`${prefix} must include a non-empty array of tags`);
    }
    if (keywords !== undefined && (!assertStringArray(keywords) || keywords.some((keyword) => !keyword.trim()))) {
      errors.push(`${prefix} has invalid keywords; they must be non-empty strings`);
    }

    if (errors.length > 0) {
      return;
    }

    normalized.push({
      id: normalizeText(id),
      question: normalizeText(question),
      answer: normalizeText(answer),
      tags: tags.map(normalizeTag),
      keywords: keywords ? keywords.map(normalizeKeywords) : undefined,
    });
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: normalized };
}
