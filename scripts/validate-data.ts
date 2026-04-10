import { readFile } from 'node:fs/promises';
import { validateAndNormalizeFaqs } from '../lib/faq-validation.js';

const filePath = new URL('../data/faqs.json', import.meta.url);

try {
  const raw = JSON.parse(await readFile(filePath, 'utf-8'));
  const result = validateAndNormalizeFaqs(raw);

  if (!result.valid) {
    console.error('FAQ validation failed:');
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('FAQ data is valid and normalized.');
  process.exit(0);
} catch (error) {
  console.error('Failed to validate FAQ data:', error);
  process.exit(1);
}
