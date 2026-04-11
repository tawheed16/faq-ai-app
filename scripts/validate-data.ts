import { validateFaqData } from '../lib/faq-service.js';

const result = validateFaqData();

if (!result.valid) {
  console.error('FAQ validation failed:');
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('FAQ data is valid and normalized.');
process.exit(0);
