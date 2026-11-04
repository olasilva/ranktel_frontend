import { useState } from 'react';
import Photo from './Photo.jsx';
import { Expand, Close } from './Icons.jsx';
export default function Gallery({ images, alt }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const multi = images.length > 1;
  return (
    <div className={multi ? 'grid grid-cols-[64px_1fr] gap-3 sm:grid-cols-[80px_1fr]' : ''}>
      {multi && (
        <div className="flex flex-col gap-3">
          {images.map((f, n) => (
            <button key={f} onClick={() => setI(n)} aria-label={`View image ${n + 1}`} aria-current={n === i} className={`border ${n === i ? 'border-accent' : 'border-line opacity-70 hover:opacity-100'}`}>
              <Photo img={f} className="aspect-[3/4]" />
            </button>
          ))}
        </div>
      )}
      <div className="relative">
        <Photo key={images[i]} img={images[i]} alt={alt} className="fade-in aspect-[4/5] w-full border border-line" />
        <button onClick={() => setZoom(true)} aria-label="Expand image" className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center bg-ink/70 hover:bg-ink"><Expand /></button>
      </div>
      {zoom && (
        <div role="dialog" aria-modal="true" aria-label="Image preview" className="backdrop-enter fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={() => setZoom(false)}>
          <button className="absolute right-4 top-4" aria-label="Close preview"><Close /></button>
          <div className="modal-enter"><Photo img={images[i]} alt={alt} className="aspect-[4/5] max-h-[90vh]" /></div>
        </div>
      )}
    </div>
  );
}
