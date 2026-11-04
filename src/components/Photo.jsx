import { useState } from 'react';
export default function Photo({ img, alt = '', className = '', imageClassName = '', light = false, fit = 'cover', children }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`photo-motion relative overflow-hidden bg-gradient-to-br ${light ? 'from-stone-200 to-stone-300' : 'from-neutral-800 to-neutral-950'} ${className}`}>
      {ok && img && <img src={`/images/${img}`} alt={alt} loading="lazy" onError={() => setOk(false)} className={`absolute inset-0 h-full w-full object-${fit} opacity-0 ${imageClassName}`} onLoad={(e) => { e.currentTarget.classList.remove('opacity-0'); }} />}
      {children}
    </div>
  );
}
