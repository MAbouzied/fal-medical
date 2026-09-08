// @ts-check
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://falclinic.com',
  // Emit real HTML files (not trailing-slash refresh stubs). Legacy WordPress
  // trailing-slash URLs are handled by public/_redirects + middleware.
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  redirects: {},
  adapter: cloudflare(),
  integrations: [react()],
  cache: { provider: cacheCloudflare() },
  security: {
    csp: {
      scriptDirective: {
        resources: ["'self'", 'https://www.googletagmanager.com'],
      },
      styleDirective: {
        resources: ["'self'"],
      },
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self' https://wa.me https://api.whatsapp.com",
        "font-src 'self' data:",
        "img-src 'self' data: blob: https://cdn.sanity.io https://lh3.googleusercontent.com https://*.googleusercontent.com https://www.googletagmanager.com https://*.google-analytics.com",
        "connect-src 'self' https://*.sanity.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
        "frame-src https://www.google.com https://maps.google.com https://youtube.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
        "media-src 'self' https://cdn.sanity.io",
        "worker-src 'self' blob:",
        'upgrade-insecure-requests',
      ],
    },
  },
  env: {
    schema: {
      GOOGLE_SERVICE_ACCOUNT_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_PRIVATE_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_SHEET_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_BOOKINGS_SHEET_NAME: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_CUSTOMERS_SHEET_NAME: envField.string({ context: 'server', access: 'secret', optional: true }),
      BLOG_PROVIDER: envField.enum({
        context: 'server',
        access: 'public',
        values: ['mock', 'sanity'],
        optional: true,
        default: 'mock',
      }),
      SANITY_PROJECT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      SANITY_DATASET: envField.string({ context: 'server', access: 'secret', optional: true }),
      SANITY_API_VERSION: envField.string({ context: 'server', access: 'secret', optional: true }),
      SANITY_API_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      SANITY_WRITE_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      BLOG_REVALIDATE_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Separate, private dataset used only for staff authorization and management.
      SANITY_AUTH_DATASET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        default: 'staff-auth',
      }),
      SANITY_AUTH_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      ADMIN_AUTH_DISABLED: envField.boolean({ context: 'server', access: 'secret', optional: true, default: false }),
      ADMIN_IMAGE_IMPORT_HOSTS: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        default: 'cdn.sanity.io',
      }),
      SEO_INDEXABLE: envField.boolean({
        context: 'server',
        access: 'public',
        optional: true,
        default: false,
      }),
      PUBLIC_SANITY_STUDIO_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      BETTER_AUTH_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      BETTER_AUTH_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_CLIENT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
