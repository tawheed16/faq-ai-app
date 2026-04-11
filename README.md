# FAQ AI App

A small Next.js App Router proof of concept for a curated FAQ assistant aimed at international students in Canada.

## What it does

- Stores curated FAQ content in `data/faqs.json`
- Validates and normalizes the dataset with a simple ETL script
- Provides a reusable retrieval module for best-match FAQ search
- Exposes a Next.js API route at `/api/search`
- Renders a minimal client-side search UI with best answer and related questions
- Includes unit tests and a prepared Playwright end-to-end test

## Supported questions

This app supports simple FAQ-style questions related to international students in Canada, such as:

- What is a SIN?
- Can I work during scheduled breaks?
- What is a study permit extension?
- Basic work eligibility questions

The system is designed for short, lookup-style queries based on curated data.

---

## Out of scope

To keep the project focused and simple, the following are not supported:

- real-time web search
- legal or immigration advice
- user accounts or authentication
- dynamic content editing (admin UI)
- large-scale or production infrastructure

This is a proof-of-concept application, not a production system.

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

## Data flow

The application processes data through a simple end-to-end pipeline:

1. FAQ data is stored in `data/faqs.json`
2. The ETL layer validates and normalizes the dataset
3. The FAQ service loads and prepares the data
4. The retrieval module ranks FAQ entries based on a query
5. The API route returns structured results
6. The UI displays the best answer and related results

This demonstrates a full workflow from ingestion → ETL → storage → reasoning → UI.

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

This app is designed to be deployed on Vercel.

### Steps

1. Push the repository to GitHub
2. Import the project into Vercel
3. Use default Next.js settings
4. Deploy and test the live URL

### Live URL

Add your deployed URL here:


### Repository

https://github.com/tawheed16/faq-ai-app

### Recommended deployment steps

1. Push the repo to GitHub.
2. Create a new Vercel project linked to this repository.
3. Use the default Next.js build settings.
4. Vercel will run `npm install` and `npm run build`.

## Skills used in development

This project follows a structured workflow using the required skills:

- **grill-me** — used to refine and narrow the project idea
- **write-a-prd** — used to define the product requirements
- **prd-to-issues** — used to break the PRD into implementation tasks
- **tdd** — used to build features with tests first
- **improve-codebase-architecture** — used to introduce a FAQ service layer for better structure

These were used during actual development, not added afterward.

## Notes

- The FAQ dataset is intentionally fixed in the repo for this proof of concept.
- The retrieval logic is separated from the API route so it can be tested and extended independently.
- The app currently returns curated answers directly, with low-confidence handling for weak query matches.
