## Problem Statement

International students in Canada—especially new arrivals—need fast, trustworthy answers to basic questions about study permits, work rules, SIN, and student life.

Today, this information is scattered across government sites, college portals, community forums, and social media. It is often written in dense legal language, hard to verify, and slow to consume. Students waste time searching and may still receive outdated or unreliable guidance for simple questions like whether they can work full time during a break.

## Solution

Build a small proof-of-concept FAQ AI assistant with a fixed, curated JSON dataset. The app will:

- store trusted FAQ content in a repo-managed JSON file
- validate and normalize that data with a simple ETL/validation step
- expose a lightweight Next.js API route for query search
- use reusable retrieval logic to score and rank FAQ matches
- render a client-side search experience with the best answer plus related questions
- signal low confidence when a query does not closely match the dataset

This delivers a focused user flow: ask a natural-language question, get a clear, reliable answer, and see related questions for context.

## User Stories

1. As an international student, I want to ask a natural question in plain language so that I can quickly learn whether I can work during a break.
2. As a new arrival, I want a clear answer to common permit questions so that I can avoid confusion from government websites.
3. As a student applying for an extension, I want to know the basic eligibility rules so that I can make the right next move.
4. As a user, I want the app to use trusted curated content instead of random Google results, so I can trust the response.
5. As a user, I want a simple search box rather than a complex dashboard, so I can get answers quickly.
6. As a developer, I want a fixed JSON dataset in the repo so I can version control the FAQ source.
7. As a maintainer, I want a validation script for the FAQ file so I can ensure every entry has the required fields and normalized values.
8. As a consumer of the API, I want the backend to return the best FAQ answer and related items so that I can see additional helpful context.
9. As a user, I want low-confidence queries to show a note, so I know when the answer may not be a strong match.
10. As a tester, I want retrieval logic separated from the API route so it can be validated independently.
11. As a developer, I want the app built in TypeScript with the App Router so the code is maintainable and modern.
12. As a product owner, I want tags and optional keywords in FAQ entries so the search can match relevant content more accurately.
13. As a user, I want the UI to show the top three related FAQ entries so I can browse nearby topics without being overwhelmed.
14. As a user, I want invalid or empty queries handled safely by the API so the app remains stable.
15. As a product owner, I want the initial version to avoid authoring UIs, databases, and real-time scraping so the scope stays small and reliable.
16. As a developer, I want the data validation step runnable from an npm script so it can be used in local development and CI.
17. As a student, I want answers delivered directly from the curated dataset so there is no unexpected generation behavior.
18. As a reviewer, I want the feature boundaries clearly defined so I understand which enhancements belong to later versions.
19. As a stakeholder, I want the app to demonstrate ingestion, transformation, storage, reasoning, and UI in a compact proof of concept.
20. As a future implementer, I want the architecture to be extensible so optional LLM rewriting and authoring can be added later.

## Implementation Decisions

- Use a fixed, repo-managed JSON file for the curated FAQ dataset.
- Keep the frontend as a minimal single-panel search interface with a client-side fetch to a Next.js App Router API route.
- Use TypeScript across the app for safer models and API contracts.
- Implement a reusable search retrieval module that scores FAQs using weighted matching over question text, tags, and keywords.
- Keep the API route thin: validate input, call the retrieval module, and return the best answer plus top 3 related FAQs and confidence metadata.
- Return FAQ answers exactly as stored in the curated JSON, without conversational rewriting in this version.
- Provide an explicit ETL/validation module for the FAQ JSON that checks schema, trims and normalizes fields, and fails on invalid data.
- Expose the data validation step through an npm command such as `npm run validate-data`.
- Display a low-confidence warning when the best match score is below a conservative threshold.
- Limit the initial UI scope to search, answer display, and related questions; do not add category filters or authoring tools in this version.

## Testing Decisions

- Test external behavior rather than internal implementation details.
- Cover the ETL/validation module with tests that verify schema validation, required field enforcement, and normalization.
- Cover the search retrieval module with tests for relevant query matching, related result ordering, and weak/no-match handling.
- Cover the API route behavior with tests for valid queries, empty/invalid query handling, and proper integration with the search module.
- Optionally add a small number of UI rendering tests for result states and error handling if time allows, but make API and backend tests the priority.
- Use the fixed FAQ dataset and controlled fixtures to ensure deterministic test behavior.

## Out of Scope

- Real-time web scraping or automatic data harvesting.
- Authentication, user accounts, or personalized profiles.
- Complex databases, vector stores, or full search infrastructure.
- Official legal advice guarantees.
- Large-scale production deployment features.
- A non-developer authoring UI for modifying the FAQ dataset.
- Conversational answer rewriting or LLM generation in the initial version.

## Further Notes

- This PRD supports a small, focused proof of concept for Canadian international student FAQ guidance.
- Future enhancements can include an authoring UI, optional LLM rewriting, runtime dataset management, richer category filters, and CI validation integration.
- The current scope emphasizes clarity, reliability, and evidence of the full data flow from curated content to user-facing search.
