import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Astro emits its hydration helper style beside the first island in <body>.
// Move only that exact helper to <head>; keep the JS and island HTML intact.
export default function normalizeIslandStyles() {
  return {
    name: 'raccoon-valid-island-styles',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const directory = fileURLToPath(dir);
        const helper = '<style>astro-island,astro-slot,astro-static-slot{display:contents}</style>';
        for (const filename of await readdir(directory, { recursive: true })) {
          if (!filename.endsWith('.html')) continue;
          const target = path.join(directory, filename);
          const html = await readFile(target, 'utf8');
          if (!html.includes(helper)) continue;
          if (!html.includes('</head>')) throw new Error(`Missing head in ${filename}`);
          await writeFile(target, html.replaceAll(helper, '').replace('</head>', `${helper}</head>`));
        }
      },
    },
  };
}
