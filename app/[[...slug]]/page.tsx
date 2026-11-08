import { notFound } from 'next/navigation';
import ClientStorefront from './ClientStorefront';

// Whitelist of valid storefront client routes
const VALID_FIRST_SEGMENTS = new Set([
  'shop',
  'museum',
  'vault',
  'custom',
  'about',
  'lookbook',
  'specs',
  'faq',
  'contact',
  'privacy',
  'terms',
  'shipping',
  'returns',
  'orders',
  'track',
  'squad',
  'group',
]);

export default async function Page({
  params,
}: {
  params?: Promise<{ slug?: string[] }>;
}) {
  const resolved = params ? await params : undefined;
  const slug = resolved?.slug;

  // Root homepage: '/' -> valid
  if (!slug || slug.length === 0) {
    return <ClientStorefront />;
  }

  const first = slug[0].toLowerCase();

  // If request ends with .html, or is an unknown path, return strict 404
  // This ensures Google Search Console verification tests for non-existent files
  // correctly receive HTTP 404 rather than an HTTP 200 homepage.
  if (first.endsWith('.html') || !VALID_FIRST_SEGMENTS.has(first)) {
    notFound();
  }

  return <ClientStorefront initialSlug={slug} />;
}
