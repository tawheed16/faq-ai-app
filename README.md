# FAQ AI App

A small Next.js App Router proof of concept for a curated FAQ assistant aimed at international students in Canada.

## What it does

- Stores curated FAQ content in `data/faqs.json`
- Validates and normalizes the dataset with a simple ETL script
- Provides a reusable retrieval module for best-match FAQ search
- Exposes a Next.js API route at `/api/search`
- Renders a minimal client-side search UI with best answer and related questions
- Includes unit tests and a prepared Playwright end-to-end test

## Architecture

- `app/page.tsx` — client-side search UI
- `app/api/search/route.ts` — search API route
- `lib/types.ts` — shared FAQ and search result types
- `lib/faq-validation.ts` — FAQ JSON validation and normalization
- `lib/faq-search.ts` — reusable retrieval/search logic
- `data/faqs.json` — curated FAQ dataset
- `scripts/validate-data.ts` — command-line validation script
- `e2e/faq-search.spec.ts` — Playwright end-to-end test
- `playwright.config.ts` — Playwright configuration

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Validation

Validate the curated JSON dataset:

```bash
npm run validate-data
```

## Unit tests

```bash
npm test
```

## End-to-end tests

To run the prepared Playwright E2E test:

```bash
npm run test:e2e
```

If this is the first time running Playwright, install the browser dependencies as needed:

```bash
npx playwright install chromium
```

## Deployment

This app is ready to deploy to Vercel as a Next.js App Router project. The `app/` directory is the canonical application entrypoint.

### Recommended deployment steps

1. Push the repo to GitHub.
2. Create a new Vercel project linked to this repository.
3. Use the default Next.js build settings.
4. Vercel will run `npm install` and `npm run build`.

## Notes

- The FAQ dataset is intentionally fixed in the repo for this proof of concept.
- The retrieval logic is separated from the API route so it can be tested and extended independently.
- The app currently returns curated answers directly, with low-confidence handling for weak query matches.
