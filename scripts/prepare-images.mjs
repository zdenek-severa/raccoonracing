// Generate optimized web assets from the supplied artwork without changing it.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directory = fileURLToPath(new URL('../public/images/', import.meta.url));
const poster = path.join(directory, 'aki-poster.png');
const { width, height } = await sharp(poster).metadata();
const crop = async (name, x, y, w, h, outputWidth) => sharp(poster)
  .extract({ left: Math.round(width * x), top: Math.round(height * y), width: Math.round(width * w), height: Math.round(height * h) })
  .resize({ width: outputWidth })
  .webp({ quality: 87 })
  .toFile(path.join(directory, name));

await crop('aki-hero.webp', .535, 0, .465, .565, 1100);
await crop('aki-portrait.webp', .54, .02, .46, .53, 800);
await crop('aki-standing.webp', .49, .505, .485, .37, 900);
await sharp(poster).resize({ width: 1122 }).webp({ quality: 86 }).toFile(path.join(directory, 'aki-poster.webp'));
await sharp(path.join(directory, 'landscape.png')).resize({ width: 1600 }).webp({ quality: 80 }).toFile(path.join(directory, 'landscape.webp'));
const socialPortrait = await sharp(path.join(directory, 'aki-hero.webp'))
  .resize(650, 630, { fit: 'cover', position: 'attention' }).toBuffer();
const socialOverlay = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="shade"><stop offset="0.35" stop-color="#251c17"/><stop offset="0.82" stop-color="#251c17" stop-opacity="0"/></linearGradient></defs><rect width="1200" height="630" fill="url(#shade)"/><g fill="#f6f2ea" font-family="Georgia,serif"><text x="70" y="230" font-size="62">Raccoon Racing</text><text x="70" y="310" font-size="40" fill="#d9b178">Aki &amp; Adi</text><text x="70" y="455" font-size="23">AUSTRALIAN CATTLE DOG</text><text x="70" y="500" font-size="23">raccoonracing.cz</text></g></svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#251c17' } })
  .composite([{ input: socialPortrait, left: 550, top: 0 }, { input: socialOverlay, left: 0, top: 0 }])
  .jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(directory, 'social-card.jpg'));
for (const name of ['aki-hero.webp', 'aki-standing.webp', 'aki-portrait.webp', 'aki-poster.webp']) {
  const metadata = await sharp(path.join(directory, name)).metadata();
  console.log(`${name}: ${metadata.width} × ${metadata.height}`);
}
console.log('Prepared 5 optimized images and social sharing card.');
