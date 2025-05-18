import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BASE_URL } from './config';

const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com';
  },
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome');
  },
  new CacheFirst({
    cacheName: 'fontawesome',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin === 'https://ui-avatars.com';
  },
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'story-map-api',
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'story-map-api-images',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin.includes('maptiler');
  },
  new CacheFirst({
    cacheName: 'maptiler-api',
  }),
);


self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');

  event.waitUntil((async () => {
    let data = { title: 'Default Title', options: { body: 'Default body' } };

    try {
      const parsed = event.data?.json();
      data = parsed;
    } catch (e) {
      const text = event.data?.text();
      data = {
        title: 'Notification',
        options: {
          body: await text,
        },
      };
    }

    await self.registration.showNotification(data.title, {
      body: data.options.body,
    });
  })());
});
