import type { MetadataRoute } from 'next';
import { PRODUCTS, MUSEUM_ITEMS } from '@/src/data/brandData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://avzvaganza.com';
  const now = new Date();

  // Core Landing & Section Routes
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      images: [
        `${baseUrl}/assets/editorial_hero_portrait.jpg`,
        `${baseUrl}/assets/desktop_poster.jpg`,
        `${baseUrl}/logo.png`,
      ],
    },
    {
      url: `${baseUrl}/#vault`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/#shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/#museum`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#custom`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/#lookbook`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#specs`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/#faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Specific Product Entries for Google Product Discovery
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((prod) => ({
    url: `${baseUrl}/#shop?product=${encodeURIComponent(prod.id)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
    images: prod.images
      ? prod.images.map((img) => `${baseUrl}${img}`)
      : prod.image
      ? [`${baseUrl}${prod.image}`]
      : undefined,
  }));

  // Museum Archival Specimens
  const museumRoutes: MetadataRoute.Sitemap = MUSEUM_ITEMS.map((item) => ({
    url: `${baseUrl}/#museum?piece=${encodeURIComponent(item.id)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
    images: item.image ? [`${baseUrl}${item.image}`] : undefined,
  }));

  return [...coreRoutes, ...productRoutes, ...museumRoutes];
}
