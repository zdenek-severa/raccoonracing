import assert from 'node:assert/strict';
import { readFile, readdir, access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { HtmlValidate } from 'html-validate';
import { XMLParser } from 'fast-xml-parser';
import { SyntaxValidator } from 'fast-xml-validator';
import { loadEnv } from 'vite';

const directory = path.resolve('dist');
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const canonical = new URL(env.SITE_URL || 'https://raccoonracing.cz/').origin + '/';
const indexable = env.INDEXING_ENABLED !== 'false';
const validator = new HtmlValidate(JSON.parse(await readFile('.htmlvalidate.json', 'utf8')));
const results = [];
let errors = 0;
for (const filename of await readdir(directory, { recursive: true })) {
  if (!filename.endsWith('.html')) continue;
  const report = await validator.validateFile(path.join(directory, filename));
  if (report.results.length === 0) results.push({ file: filename, errors: 0, warnings: 0, messages: [] });
  for (const result of report.results) {
    errors += result.errorCount;
    results.push({ file: filename, errors: result.errorCount, warnings: result.warningCount, messages: result.messages.map(({ ruleId, message, selector }) => ({ ruleId, message, selector })) });
  }
}
await mkdir('reports', { recursive: true });
await writeFile('reports/html-validation.json', JSON.stringify(results, null, 2) + '\n');
if (errors) {
  console.error(JSON.stringify(results, null, 2));
  throw new Error(`HTML validation failed: ${errors} errors`);
}
console.log('HTML5: all generated pages passed (report: reports/html-validation.json).');

const html = await readFile(path.join(directory, 'index.html'), 'utf8');
const notFound = await readFile(path.join(directory, '404.html'), 'utf8');
const robots = await readFile(path.join(directory, 'robots.txt'), 'utf8');
const xml = await readFile(path.join(directory, 'sitemap.xml'), 'utf8');
const tags = (name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(match => match[0]);
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const meta = (name) => {
  const found = tags('meta').filter(tag => attr(tag, 'name') === name || attr(tag, 'property') === name);
  assert.equal(found.length, 1, `Exactly one ${name} metadata tag required`);
  return attr(found[0], 'content');
};

assert.match(html, /<html lang="cs">/);
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Exactly one H1');
assert.equal((html.match(/<title>/g) || []).length, 1, 'Exactly one title');
assert.ok(html.match(/<title>([^<]+)<\/title>/)?.[1].includes('australského honáckého psa'));
assert.ok(meta('description').length >= 100 && meta('description').length <= 170);
const canonicalLinks = tags('link').filter(tag => attr(tag, 'rel') === 'canonical');
assert.equal(canonicalLinks.length, 1);
assert.equal(attr(canonicalLinks[0], 'href'), canonical);
assert.equal(meta('og:url'), canonical);
assert.equal(meta('og:image'), new URL('/images/social-card.jpg', canonical).href);
assert.equal(meta('twitter:image'), meta('og:image'));
assert.equal(meta('og:image:width'), '1200');
assert.equal(meta('og:image:height'), '630');
assert.equal(meta('twitter:card'), 'summary_large_image');
assert.equal(meta('robots').startsWith('index,'), indexable);
assert.match(notFound, /name="robots" content="noindex, follow"/);
assert.ok(!notFound.includes('rel="canonical"'), '404 must not canonicalize to home');
assert.match(robots, /User-agent: \*\nAllow: \//);
assert.ok(!robots.match(/^Disallow:\s*\//m), 'Do not block crawler access to HTML/assets');
assert.equal(robots.includes(`Sitemap: ${canonical}sitemap.xml`), indexable);
assert.equal(SyntaxValidator.validate(xml), true, 'Sitemap must be well-formed XML');
const sitemap = new XMLParser({ ignoreAttributes: false }).parse(xml);
assert.equal(sitemap.urlset['@_xmlns'], 'http://www.sitemaps.org/schemas/sitemap/0.9');
assert.equal(sitemap.urlset.url?.loc, indexable ? canonical : undefined);
assert.ok(!xml.includes('#'), 'Sitemap must not contain fragment sections');

const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)?.[1] || 'null');
assert.equal(graph['@context'], 'https://schema.org');
assert.deepEqual(graph['@graph'].map(node => node['@type']), ['Organization', 'WebSite', 'WebPage']);
assert.equal(graph['@graph'][0].contactPoint.length, 2);
assert.equal(graph['@graph'][0].contactPoint[0].email, 'zdenek.severa@gmail.com');
assert.equal(graph['@graph'][0].contactPoint[1].email, 'kmetkova.peta@gmail.com');
assert.equal(graph['@graph'][2].url, canonical);
assert.ok(!html.includes('\\u00a0'), 'Non-breaking spaces must render as actual characters');
assert.ok(html.includes('BAER OK') && html.includes('NHAT'), 'All profile tabs must exist in server-rendered HTML');
assert.ok(html.includes('jak žijete') && html.includes('Osobní seznámení'), 'FAQ answers must exist before JavaScript runs');
assert.ok(!html.includes('\uFFFD'), 'No replacement characters in UTF-8 text');

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
for (const tag of [...tags('a'), ...tags('link'), ...tags('img'), ...tags('script')]) {
  const target = attr(tag, 'src') || attr(tag, 'href');
  if (!target) continue;
  if (target.startsWith('#')) {
    if (target !== '#') assert.ok(ids.has(target.slice(1)), `Missing section ${target}`);
  } else if (target.startsWith('/') && !target.startsWith('//')) {
    await access(path.join(directory, decodeURI(target.split(/[?#]/)[0]).replace(/^\//, '')));
  }
}
for (const image of tags('img')) {
  assert.ok(attr(image, 'alt'), 'Every content image needs alternative text');
  assert.ok(Number(attr(image, 'width')) > 0 && Number(attr(image, 'height')) > 0, 'Images must reserve their dimensions');
}
console.log(`SEO: canonical, ${indexable ? 'production indexation' : 'staging noindex'}, sitemap XML, robots.txt, social metadata, JSON-LD, links, images and SSR content passed.`);
