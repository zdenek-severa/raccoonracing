import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import normalizeIslandStyles from './scripts/normalize-island-styles.mjs';

const env = { ...loadEnv(process.env.NODE_ENV || 'production', process.cwd(), ''), ...process.env };
const url = new URL(env.SITE_URL || 'https://raccoonracing.cz/');
if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || ['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname)) {
  throw new Error('SITE_URL musí být veřejná HTTPS doména bez cesty, přihlašovacích údajů, query a fragmentu.');
}

export default defineConfig({
  site: url.origin + '/',
  trailingSlash: 'always',
  integrations: [react(), normalizeIslandStyles()],
  vite: { plugins: [tailwindcss()] },
});
