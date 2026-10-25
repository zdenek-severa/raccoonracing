import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const indexable = import.meta.env.PROD && import.meta.env.INDEXING_ENABLED !== 'false' && !!site;
  // Crawlers must be able to read the page's noindex directive on previews.
  const content = ['User-agent: *', 'Allow: /', ...(indexable ? ['', `Sitemap: ${new URL('/sitemap.xml', site).href}`] : ['','# Indexing is disabled by the HTML robots meta tag.']), ''].join('\n');
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
