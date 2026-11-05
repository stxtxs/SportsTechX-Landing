import type { MetadataRoute } from 'next';
import { SITE_URL } from './layout';

/**
 * The web manifest. `maskable` matters on Android: without it the launcher
 * crops the icon into its own shape and clips the mark.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SportsTechX',
    short_name: 'SportsTechX',
    description:
      'Connecting the people, intelligence and capital transforming the business of sports.',
    id: SITE_URL,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ec1e5f',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      /* Maskable points at the OPAQUE icon on purpose: the launcher crops to its
         own shape, and a transparent source leaves the mark floating on nothing. */
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
