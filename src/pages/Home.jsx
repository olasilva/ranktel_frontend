import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHome } from '../api.js';
import { naira } from '../format.js';
import { TONES } from '../data.js';
import Photo from '../components/Photo.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { Store, Heart } from '../components/Icons.jsx';
import { useWishlist } from '../CartContext.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';

const CATS = [
  ['Clothing', 'Denim, Outerwear & Tops', '/clothing', 'clothes.png'],
  ['Shoes', 'Sneakers, Mules & Slides', '/shoes', 'shopping.png'],
  ['Bags', 'Cross-Body & Travel Rig', '/bags', 'bags.png'],
  ['Accessories', 'Belts, Hardware & Caps', '/accessories', 'clothes.png'],
];
const PERKS = [
  ['Store pickup in Kurudu', 'Visit our Kurudu, Abuja hub to inspect, try on, and collect your order directly.', 'Pay at store available', 'text-cobalt'],
  ['48-hr hold guarantee', 'Reserve rare drop pieces online without pre-paying. We hold your size for 48 hours.', 'Zero cancellation fee', 'text-accent'],
  ['Instant Paystack pay', 'Encrypted cards, bank transfers, USSD, and Apple Pay processed seamlessly.', '100% fraud protected', 'text-neutral-300'],
  ['Nationwide express', 'Same-day Abuja delivery; 24–48 hours to Lagos, Port Harcourt, and Kano.', 'Live tracking SMS', 'text-neutral-300'],
];

export default function Home() {
  const [arrivals, setArrivals] = useState(null);
  const [err, setErr] = useState('');
  const wl = useWishlist();
  const load = () => { setErr(''); getHome().then((r) => setArrivals(r.arrivals)).catch((e) => setErr(e.message)); };
  useEffect(load, []);
  useEffect(() => { document.title = 'Ranktel | Luxury unisex streetwear, designed in Nigeria'; }, []);

  return (
    <main>
      {/* Hero */}
      <section className="wrap grid gap-4 py-6 lg:grid-cols-[2fr_1fr]">
        <Photo img="shopping.png" alt="Ranktel footwear season drop" className="reveal-left min-h-[420px] lg:min-h-[520px]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="relative flex h-full min-h-[420px] flex-col justify-end p-6 sm:p-10 lg:min-h-[520px]">
            <p className="label fade-in stagger-1 !text-accent">Lagos nocturnal • Fluid architecture</p>
            <h1 className="display reveal-up stagger-2 mt-3 text-5xl sm:text-7xl">Wear<br />it<br /><span className="text-accent">your<br />way</span></h1>
            <p className="reveal-up stagger-3 mt-4 max-w-sm text-sm text-neutral-300">New season drops engineered for effortless presence, tectonic balance, and fluid street luxury.</p>
            <div className="reveal-up stagger-4 mt-6 flex flex-wrap gap-3"><Link to="/clothing" className="btn-cobalt">Shop new arrivals →</Link><Link to="/sale" className="btn-line">Explore archive</Link></div>
          </div>
        </Photo>
        <div className="grid gap-4">
          <Tile img="clothes.png" name="Textured Denim Rig" price={85000} cta="Inspect unit" to="/clothing" />
          <Tile img="shopping.png" name="Chunky White Monolith" price={55000} cta="Secure size" to="/product/chunky-white-monolith" badge="Restocked" />
        </div>
      </section>

      {/* Categories */}
      <section className="wrap py-14">
        <p className="eyebrow">Architectural categorisation</p>
        <h2 className="display mt-3 text-3xl sm:text-4xl">System categories</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATS.map(([t, s, to, img], i) => (
            <ScrollReveal key={t} delay={i * 80}>
            <Link to={to} className="card-motion group block bg-panel">
              <Photo img={img} alt={t} className="aspect-[4/5]" />
              <div className="flex items-center justify-between p-4"><div><h3 className="font-display text-base font-bold uppercase tracking-wide">{t}</h3><p className="mt-1 text-[11px] text-muted">{s}</p></div><span className="text-lg transition group-hover:translate-x-1" aria-hidden>↗</span></div>
            </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="wrap py-10">
        <p className="eyebrow">Limited release archive</p>
        <h2 className="display mt-3 text-3xl sm:text-4xl">New arrivals</h2>
        {err && <div className="py-12 text-center"><p className="text-muted">{err}</p><button className="btn-line mt-3" onClick={load}>Try again</button></div>}
        {!arrivals && !err && <p className="py-12 text-center text-sm text-muted">Loading…</p>}
        {arrivals && (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {arrivals.map((a) => (
              <ScrollReveal key={a.slug} delay={arrivals.indexOf(a) * 80}>
              <article className="card-motion relative bg-panel">
                <Link to={`/product/${a.slug}`} className="block">
                  <Photo img={a.img} alt={a.name} className="aspect-[4/5]" light />
                  <div className="p-4">
                    <p className="label !text-[9px]">{a.kicker}</p>
                    <h3 className="mt-2 min-h-[2.8rem] font-display text-lg font-semibold uppercase leading-tight">{a.name}</h3>
                    <p className="mt-3 flex items-end justify-between gap-2"><b>{naira(a.price)}</b><span className="label !text-[9px]">{a.meta}</span></p>
                  </div>
                </Link>
                {a.badge && <span className={`absolute left-2 top-2 px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${TONES[a.badge.tone]}`}>{a.badge.text}</span>}
                <button onClick={() => wl.toggle(a.slug)} aria-pressed={wl.has(a.slug)} aria-label={`Save ${a.name} to wishlist`} className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-ink/80 ${wl.has(a.slug) ? 'text-accent' : ''}`}><Heart filled={wl.has(a.slug)} /></button>
              </article>
              </ScrollReveal>
            ))}
          </div>
        )}
        <div className="py-10 text-center"><Link to="/clothing" className="btn-line">View all new arrivals →</Link></div>
      </section>

      {/* Manifesto */}
      <section className="wrap grid items-stretch gap-8 py-14 lg:grid-cols-[1fr_1.1fr]">
        <Photo img="manifesto.jpg" alt="Ranktel campaign" className="min-h-[420px]" />
        <div className="flex flex-col justify-center">
          <p className="eyebrow flex items-center gap-2"><i className="inline-block h-px w-6 bg-accent" />Manifesto 2026</p>
          <h2 className="display mt-4 text-3xl sm:text-5xl">“Designed in Nigeria.<br /><span className="text-accent">Cut for everyone.</span>”</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">Ranktel exists at the intersection of Abuja’s planned monumental geometry and Lagos’ relentless nocturnal velocity. Every seam, pleat, and closure is engineered unisex—proportioned to drape naturally on all forms without gendered compromise.</p>
          <div className="mt-7 flex gap-4 bg-panel p-4">
            <Photo img="manifesto-thumb.jpg" className="h-28 w-24 shrink-0" />
            <dl className="flex-1 space-y-2 text-xs">
              {[['Cut origin', 'Kurudu Atelier, Abuja'], ['Textile grade', 'Heavy Gauge 100% Cotton'], ['Unisex proportions', 'Universal Fluid Drape']].map(([k, v], i) => (
                <div key={k} className="flex justify-between gap-3"><dt className="label !text-[9px]">{k}</dt><dd className={`text-right ${i === 2 ? 'text-accent' : ''}`}>{v}</dd></div>
              ))}
              <Link to="/clothing" className="label !text-white underline">View full runway editorial →</Link>
            </dl>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="bg-foot py-8">
        <div className="wrap grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map(([t, d, tag, tone], i) => (
            <div key={t} className="flex flex-col bg-ink/50 p-4">
              <span className={i === 1 ? 'text-accent' : 'text-lav'}><Store /></span>
              <h3 className="mt-3 text-xs font-bold uppercase tracking-wider">{t}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{d}</p>
              <p className={`mt-3 text-[9px] font-bold uppercase tracking-[0.16em] ${tone}`}>{tag}</p>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}

function Tile({ img, name, price, cta, to, badge }) {
  return (
    <Photo img={img} alt={name} className="min-h-[250px]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      {badge && <span className="absolute right-3 top-3 bg-cobalt px-2 py-1 text-[9px] font-bold uppercase tracking-widest">{badge}</span>}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div><h3 className="font-display text-base font-bold uppercase">{name}</h3><p className="mt-1 text-sm font-semibold text-accent">{naira(price)}</p></div>
        <Link to={to} className="label !text-white underline">{cta}</Link>
      </div>
    </Photo>
  );
}
