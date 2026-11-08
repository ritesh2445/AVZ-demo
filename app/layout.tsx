import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FAQS, PRODUCTS, BRAND_INFO } from '@/src/data/brandData';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://aveezahvaganza.com';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'AVZ VAGANZA | THE OTHER DIMENSION — Wearable Art & Cyber-Couture by Dhrisni',
    template: '%s | AVZ VAGANZA',
  },
  description:
    'AVZ Vaganza (Aveezah Vaganza) by Dhrisni (@Dhristroyer). Sustainable avant-garde luxury fashion, sculptural wearable art, cyber-grunge couture, upcycled motherboards, heavy chainmail, solid spikes, and custom 1-of-1 pieces handcrafted in Guwahati, Assam.',
  keywords: [
    'AVZ Vaganza',
    'Aveezah Vaganza',
    'Dhrisni',
    'Dhristroyer',
    'Dhrisni fashion',
    'wearable art India',
    'avant-garde fashion brand',
    'cyber grunge fashion',
    'upcycled motherboard clothing',
    'hardware couture',
    'chainmail armour fashion',
    'custom corset designer India',
    'Y2K alternative clothing',
    'industrial punk streetwear',
    'sustainable luxury fashion label',
    'one of a kind fashion pieces',
    'handcrafted clothing Guwahati Assam',
    'celebrity wearable art designer',
    'spike bodice',
    'motherboard diva top',
    'fashion art installation',
  ],
  authors: [{ name: 'Dhrisni (Dhristroyer)', url: 'https://instagram.com/dhristroyer' }],
  creator: 'Dhrisni (Dhristroyer)',
  publisher: 'AVZ Vaganza Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: 'AVZ VAGANZA | THE OTHER DIMENSION — Wearable Art by Dhrisni',
    description:
      'An experimental, psychedelic, three-dimensional fashion universe. Handcrafted sculptural wearable art by Dhrisni (@Dhristroyer) utilizing reclaimed motherboards, computer hardware, spikes, and upcycled denim.',
    url: APP_URL,
    siteName: 'AVZ Vaganza',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${APP_URL}/assets/editorial_hero_portrait.jpg`,
        width: 1200,
        height: 630,
        alt: 'AVZ Vaganza Wearable Art by Dhrisni (Dhristroyer)',
      },
      {
        url: `${APP_URL}/logo.png`,
        width: 512,
        height: 512,
        alt: 'AVZ Vaganza Brand Crest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVZ VAGANZA | Wearable Art by Dhrisni (Dhristroyer)',
    description:
      'Sculptural wearable art, upcycled motherboards, spikes, and handmade cyber-couture by Dhrisni. Handcrafted in Guwahati, Assam.',
    creator: '@dhristroyer',
    images: [`${APP_URL}/assets/editorial_hero_portrait.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.webmanifest',
  category: 'Fashion & Wearable Art',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-avz-vaganza',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org: Organization / ClothingStore
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'AVZ Vaganza',
    alternateName: ['Aveezah Vaganza', 'AVZ by Dhrisni', 'Dhristroyer Studio'],
    url: APP_URL,
    logo: `${APP_URL}/logo.png`,
    image: `${APP_URL}/assets/editorial_hero_portrait.jpg`,
    description:
      'Sustainable avant-garde high fashion label and sculptural wearable art studio founded and designed by Dhrisni (Dhristroyer). Handcrafted 1-of-1 pieces from upcycled motherboards, denim, spikes, and chainmail.',
    founder: {
      '@type': 'Person',
      name: 'Dhrisni',
      alternateName: 'Dhristroyer',
      jobTitle: 'Founder & Creative Director',
      sameAs: ['https://instagram.com/dhristroyer'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Guwahati',
      addressRegion: 'Assam',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '26.1445',
      longitude: '91.7362',
    },
    telephone: '+91-73042-64901',
    priceRange: '₹₹₹',
    sameAs: [
      'https://instagram.com/dhristroyer',
      'https://instagram.com/avzvaganza',
    ],
  };

  // Schema.org: WebSite with SearchAction for Google Sitelinks Searchbox
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AVZ Vaganza',
    alternateName: 'AVZ Vaganza | The Other Dimension',
    url: APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/#shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Schema.org: FAQPage for rich search accordion snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  // Schema.org: ItemList for Google Product carousels
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Curated Wearable Art Archive',
    description: 'One-of-a-kind sculptural garments and wearable art handcrafted by Dhrisni in Guwahati.',
    numberOfItems: PRODUCTS.length,
    itemListElement: PRODUCTS.map((prod, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: prod.name,
        image: prod.image ? `${APP_URL}${prod.image}` : undefined,
        description: prod.description || `Handcrafted wearable art piece by Dhrisni. Category: ${prod.category}.`,
        category: prod.category,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: prod.price,
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'AVZ Vaganza',
          },
        },
      },
    })),
  };

  return (
    <html lang="en">
      <head>
        {/* Vimeo Video Stream Preconnect & DNS-Prefetch for Instant Parallel Loading */}
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://f.vimeocdn.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        <link rel="dns-prefetch" href="https://player.vimeo.com" />
        <link rel="dns-prefetch" href="https://f.vimeocdn.com" />

        {/* Google Fonts: League Spartan, Montserrat, Cinzel, Reenie Beanie, Space Grotesk, Syne */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=League+Spartan:wght@300;400;600;700;800;900&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Reenie+Beanie&family=Space+Grotesk:wght@400;600;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />

        {/* Schema.org JSON-LD Structured Data for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      </head>
      <body className="bg-black text-silver antialiased selection:bg-pink selection:text-black overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
