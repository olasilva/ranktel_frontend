import { Link } from 'react-router-dom';
import { useWishlist } from '../CartContext.jsx';
import { naira } from '../format.js';
import { TONES } from '../data.js';
import Photo from './Photo.jsx';
import { Heart } from './Icons.jsx';
export default function ProductCard({ it }) {
  const wl = useWishlist();
  const on = wl.has(it.slug);
  return (
    <article className="card-motion group relative bg-panel">
      <Link to={`/product/${it.slug}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
        <Photo img={it.img} alt={it.name} className="aspect-[4/5]" light />
        <div className="p-4">
          <div className="flex items-center justify-between">
            <p className="label !text-[9px]">{it.kicker}</p>
            <span className="flex gap-1" aria-hidden>{it.colors.map((c) => <i key={c} className="h-2.5 w-2.5 rounded-full border border-white/20" style={{ background: c }} />)}</span>
          </div>
          <h3 className="mt-2 min-h-[2.6rem] font-display text-lg font-semibold leading-tight">{it.name}</h3>
          {it.blurb && <p className="mt-1 text-xs text-muted">{it.blurb}</p>}
          <p className="mt-3 flex items-end justify-between gap-2"><b className="text-base">{naira(it.price)}</b><span className="label !text-[9px]">{it.stockState === 'out' ? 'Out of stock' : it.meta}</span></p>
        </div>
      </Link>
      {it.badge && <span className={`absolute left-2 top-2 px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${TONES[it.badge.tone]}`}>{it.badge.text}</span>}
      <button onClick={() => wl.toggle(it.slug)} aria-pressed={on} aria-label={on ? `Remove ${it.name} from wishlist` : `Save ${it.name} to wishlist`} className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink/80 hover:bg-ink ${on ? 'text-accent' : ''}`}><Heart filled={on} /></button>
    </article>
  );
}
