import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const indexable = import.meta.env.PROD && import.meta.env.INDEXING_ENABLED !== 'false' && !!site;
  const escape = (value: string) => value.replace(/[<>&'\"]/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]!);
  // The site is one page: fragment sections are not separate indexable URLs.
  const entries = indexable ? `<url><loc>${escape(new URL('/', site).href)}</loc></url>` : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
