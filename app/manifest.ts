import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AVZ VAGANZA | THE OTHER DIMENSION',
    short_name: 'AVZ Vaganza',
    description: 'Experimental Wearable Art, Cyber-Couture & Digital Fashion by Dhrisni (Dhristroyer)',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

