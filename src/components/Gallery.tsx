import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const photos = [
  { src: '/images/aki-portrait.webp', width: 800, height: 1152, title: 'Pohled, který vám neunikne', tag: 'AKI · PORTRÉT', alt: 'Portrét červeně tečkovaného australského honáckého psa Akiho' },
  { src: '/images/aki-standing.webp', width: 900, height: 859, title: 'Honák každým coulem', tag: 'AKI · EXTERIÉR', alt: 'Aki v postoji ve zlatém večerním světle' },
  { src: '/images/aki-poster.webp', width: 1122, height: 1402, title: 'Seznamte se s Akim', tag: 'AKI · PREZENTAČNÍ PLAKÁT', alt: 'Celý prezentační plakát Akiho s rodokmenem a výsledky' },
];
const slides = photos.map(({ title, ...photo }) => ({ ...photo, description: title }));

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  return <>
    <div className="gallery-grid">{photos.map((photo, i) => <button type="button" className={`gallery-card gallery-card-${i}`} key={photo.src} onClick={() => setSelected(i)} aria-label={`Zvětšit: ${photo.title}`}><img src={photo.src} alt={photo.alt} loading="lazy" width={photo.width} height={photo.height} decoding="async" /><span className="gallery-overlay"><small>{photo.tag}</small><span>{photo.title}<b aria-hidden="true">↗</b></span></span></button>)}</div>
    <Lightbox
      className="raccoon-lightbox"
      open={selected !== null}
      close={() => setSelected(null)}
      index={selected ?? 0}
      slides={slides}
      plugins={[Captions, Counter, Fullscreen, Thumbnails, Zoom]}
      carousel={{ imageFit: 'contain', padding: '32px', spacing: '12%', preload: 1 }}
      animation={{ fade: 200, swipe: 300 }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true, aria: true }}
      thumbnails={{ width: 80, height: 60, gap: 12, padding: 3, borderRadius: 2, imageFit: 'contain', vignette: false }}
      captions={{ descriptionTextAlign: 'center' }}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      labels={{
        Close: 'Zavřít galerii',
        Next: 'Další fotografie',
        Previous: 'Předchozí fotografie',
        'Zoom in': 'Přiblížit',
        'Zoom out': 'Oddálit',
        'Enter Fullscreen': 'Celá obrazovka',
        'Exit Fullscreen': 'Ukončit celou obrazovku',
        'Show thumbnails': 'Zobrazit náhledy',
        'Hide thumbnails': 'Skrýt náhledy',
        'Show captions': 'Zobrazit popisky',
        'Hide captions': 'Skrýt popisky',
        'Photo gallery': 'Fotogalerie Akiho',
        Lightbox: 'Prohlížeč fotografií',
        Carousel: 'Fotogalerie',
        Slide: 'Fotografie',
        Thumbnails: 'Náhledy fotografií',
        Caption: 'Popisek fotografie',
        '{index} of {total}': 'Fotografie {index} z {total}',
      }}
    />
  </>;
}
