'use client';

import { useState } from 'react';

type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  keywords?: string[];
};

type SearchResult = {
  best: FaqEntry | null;
  related: FaqEntry[];
  lowConfidence: boolean;
};

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    const trimmed = query.trim();
    if (!trimmed) {
      setError('Please enter a question or query.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Search request failed.');
      }

      const payload = await response.json();
      setResult(payload);
    } catch (err) {
      setError((err as Error).message || 'Unable to search FAQs.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">FAQ AI Search</p>
          <h1>Ask your FAQ question and get the best answer.</h1>
          <p className="description">
            Search the FAQ repository and see the most relevant answer plus related questions for quick context.
          </p>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <label htmlFor="query">What do you want to know?</label>
          <div className="input-group">
            <input
              id="query"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Examples: reset password, contact support, billing"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching…' : 'Search FAQ'}
            </button>
          </div>
        </form>

        {error ? <p className="error-message">{error}</p> : null}

        {result ? (
          <div className="results-grid">
            <section className="answer-card">
              <div className="result-badge">Best match</div>
              {result.best ? (
                <>
                  <h2>{result.best.question}</h2>
                  <p>{result.best.answer}</p>
                  <div className="tag-row">
                    {result.best.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  <p className="no-match-title">No close match found.</p>
                  <p className="no-match-subtitle">
                    Try a different phrasing or a more specific question.
                  </p>
                </div>
              )}
              {result.lowConfidence && result.best ? (
                <p className="low-confidence-note">
                  This answer is the best match, but confidence is low. You may want to rephrase or try a different query.
                </p>
              ) : null}
            </section>

            <aside className="related-card">
              <h3>Related questions</h3>
              {result.related.length > 0 ? (
                <ul>
                  {result.related.map((item) => (
                    <li key={item.id}>
                      <strong>{item.question}</strong>
                      <div className="tag-row">
                        {item.tags.map((tag) => (
                          <span key={tag} className="tag related-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No related questions matched closely.</p>
              )}
            </aside>
          </div>
        ) : null}
      </section>
    </main>
  );
}
