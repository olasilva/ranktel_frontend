import { Link } from 'react-router-dom';
import Photo from './Photo.jsx';
import { naira } from '../format.js';
import ScrollReveal from './ScrollReveal.jsx';
export default function ProductRow({ id, eyebrow, title, aside, items, dark }) {
  return (
    <section id={id} className={`py-14 ${dark ? 'bg-[#0f0f13]' : ''}`}>
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="eyebrow">{eyebrow}</p><h2 className="display mt-3 text-3xl">{title}</h2></div>
          <Link to="/clothing" className="label hover:text-white">{aside}</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((it, i) => (
            <ScrollReveal key={it.slug} delay={i * 80}>
            <Link to={`/product/${it.slug}`} className="card-motion group block bg-panel">
              <Photo img={it.img} alt={it.name} className="aspect-[3/4]">
                <span className="absolute left-2 top-2 bg-ink/80 px-2 py-1 text-[9px] font-bold uppercase tracking-widest">{it.tag}</span>
              </Photo>
              <div className="p-4">
                <p className="label !text-[9px]">{it.series}</p>
                <h3 className="mt-1 text-xs font-bold uppercase leading-snug tracking-wide">{it.name}</h3>
                <p className="mt-2 text-sm font-semibold">{naira(it.price)}</p>
              </div>
            </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
