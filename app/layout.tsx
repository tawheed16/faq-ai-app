import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ AI App',
  description: 'Search JSON-based FAQ data and get the best matching answer with related questions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
