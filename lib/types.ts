export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  keywords?: string[];
};

export type SearchResult = {
  best: FaqEntry | null;
  related: FaqEntry[];
  lowConfidence: boolean;
  bestScore: number;
};
