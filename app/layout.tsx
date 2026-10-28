import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://avzvaganza.com'),
  title: 'AVZ VAGANZA | THE OTHER DIMENSION — Experimental Wearable Art & Digital Fashion',
  description:
    'AVZ Vaganza (Aveezah Vaganza) by Dhrisni (Dhristroyer). Sustainable avant-garde high fashion, sculptural wearable art, cyber-couture, upcycled motherboards, spikes, chainmail, and archival bespoke pieces.',
  keywords: [
    'AVZ Vaganza website',
    'Aveezah brand',
    'Dhrisni fashion label',
    'Dhristroyer clothing brand',
    'independent alternative fashion brand India',
    'sustainable high fashion label India',
    'cyber grunge clothing India',
    'Y2K streetwear brand',
    'industrial punk fashion',
    'avant garde wearable art',
    'mermaidcore fashion pieces',
    'upcycled fashion brand India',
    'hardware clothing',
    'computer motherboard fashion',
  ],
  openGraph: {
    title: 'AVZ VAGANZA | THE OTHER DIMENSION',
    description: 'An Experimental, Psychedelic, Three-Dimensional Fashion Universe. Handcrafted wearable art by Dhrisni.',
    images: ['/logo.png'],
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
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
  return (
    <html lang="en">
      <head>
        {/* Google Fonts: League Spartan, Montserrat, Cinzel, Reenie Beanie, Space Grotesk, Syne */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=League+Spartan:wght@300;400;600;700;800;900&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Reenie+Beanie&family=Space+Grotesk:wght@400;600;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />

        {/* Ultra High-Definition Editorial Fashion Reel Preloads */}
        <link
          rel="preload"
          href="/assets/hero_reel_desktop.mp4"
          as="video"
          type="video/mp4"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          href="/assets/hero_reel_mobile.mp4"
          as="video"
          type="video/mp4"
          media="(max-width: 767px)"
        />
      </head>
      <body className="bg-black text-silver antialiased selection:bg-pink selection:text-black overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
