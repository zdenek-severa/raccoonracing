import { useEffect, useRef, useState } from 'react';

const photos = [
  { src: '/images/aki-portrait.webp', width: 800, height: 1152, title: 'Pohled, který vám neunikne', tag: 'AKI · PORTRÉT', alt: 'Portrét červeně tečkovaného australského honáckého psa Akiho' },
  { src: '/images/aki-standing.webp', width: 900, height: 859, title: 'Honák každým coulem', tag: 'AKI · EXTERIÉR', alt: 'Aki v postoji ve zlatém večerním světle' },
  { src: '/images/aki-poster.webp', width: 1122, height: 1402, title: 'Seznamte se s Akim', tag: 'AKI · PREZENTAČNÍ PLAKÁT', alt: 'Celý prezentační plakát Akiho s rodokmenem a výsledky' },
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  const move = (direction: number) => setSelected(value => value === null ? null : (value + direction + photos.length) % photos.length);
  return <>
    <div className="gallery-grid">{photos.map((photo, i) => <button type="button" className={`gallery-card gallery-card-${i}`} key={photo.src} onClick={() => setSelected(i)} aria-label={`Zvětšit: ${photo.title}`}><img src={photo.src} alt={photo.alt} loading="lazy" width={photo.width} height={photo.height} decoding="async" /><span className="gallery-overlay"><small>{photo.tag}</small><span>{photo.title}<b aria-hidden="true">↗</b></span></span></button>)}</div>
    <dialog ref={dialog} className="lightbox" onCancel={() => setSelected(null)} onClick={e => { if (e.target === dialog.current) setSelected(null); }} onKeyDown={e => { if (e.key === 'ArrowLeft') move(-1); if (e.key === 'ArrowRight') move(1); }} aria-label="Fotogalerie Akiho">
      {selected !== null && <div className="lightbox-inner"><button className="lightbox-close" type="button" onClick={() => setSelected(null)} aria-label="Zavřít galerii">✕</button><img src={photos[selected].src} alt={photos[selected].alt} /><div className="lightbox-controls"><button type="button" onClick={() => move(-1)} aria-label="Předchozí fotografie">←</button><span>{photos[selected].title} · {selected + 1}/{photos.length}</span><button type="button" onClick={() => move(1)} aria-label="Další fotografie">→</button></div></div>}
    </dialog>
  </>;
}
