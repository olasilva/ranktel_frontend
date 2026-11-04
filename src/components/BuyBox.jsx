import { useState } from 'react';
import { useCart, useWishlist } from '../CartContext.jsx';
import { naira } from '../format.js';
import { Heart, Store, Close } from './Icons.jsx';
import Accordion from './Accordion.jsx';

export default function BuyBox({ p, config, onAdded }) {
  const cart = useCart();
  const [color, setColor] = useState(p.colors[0]);
  const firstOpen = p.sizes.find((s) => s.stock > 0)?.size;
  const [size, setSize] = useState(p.defaultSize ?? firstOpen);
  const wl = useWishlist();
  const wish = wl.has(p.slug);
  const [guide, setGuide] = useState(false);
  const off = p.compareAt ? Math.floor((1 - p.price / p.compareAt) * 100) : 0;
  const [first, ...rest] = p.name.split(' - ');

  const add = () => {
    cart.add({ slug: p.slug, name: p.name, price: p.price, color: color.name, colorLabel: color.label, size, sizeLabel: p.sizeShort, img: p.images[0] });
    onAdded();
  };
  return (
    <div>
      <p className="eyebrow">{p.eyebrow}</p>
      <h1 className="display mt-3 text-3xl sm:text-4xl">{first}{rest.length > 0 && <> - <br />{rest.join(' - ')}</>}</h1>
      {p.rating && <p className="mt-3 flex items-center gap-2 text-sm"><span className="text-accent" aria-hidden>★★★★★</span><b>{p.rating}</b><span className="text-muted">({p.reviewCount} verified reviews)</span></p>}
      <p className="mt-6 flex items-center gap-3"><span className="text-2xl font-bold">{naira(p.price)}</span>{p.compareAt && <><s className="text-sm text-muted">{naira(p.compareAt)}</s><span className="bg-accent px-2 py-0.5 text-[10px] font-bold text-black">{off}% OFF</span></>}</p>

      <div className="mt-6 flex items-center justify-between"><span className="label">Color:</span><span className="text-xs">{color.label}</span></div>
      <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(p.colors.length, 4)}, minmax(0, 1fr))` }} role="radiogroup" aria-label="Colour">
        {p.colors.map((c) => (
          <button key={c.name} role="radio" aria-checked={c.name === color.name} onClick={() => setColor(c)} className={`flex items-center justify-center gap-2 border py-2.5 text-[10px] font-bold uppercase tracking-widest ${c.name === color.name ? 'border-cobalt bg-panel2' : 'border-line text-muted hover:text-white'}`}>
            <span className="h-3 w-3 rounded-sm border border-white/20" style={{ background: c.hex }} />{c.name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="label">{p.sizeLabel}: <b className="text-accent">{size}</b></span>
        {p.sizeChart && <button onClick={() => setGuide(true)} className="label underline hover:text-white">Size guide &amp; measurements</button>}
      </div>
      <div className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(46px, 1fr))' }} role="radiogroup" aria-label={p.sizeLabel}>
        {p.sizes.map((s) => {
          const out = s.stock < 1;
          return (
            <div key={s.size} className="relative">
              {!out && s.stock <= 3 && <span className="absolute -top-2 right-0 z-10 bg-cobalt px-1 text-[8px] font-bold">FEW</span>}
              <button role="radio" aria-checked={size === s.size} disabled={out} onClick={() => setSize(s.size)} className={`w-full border py-3 text-sm font-semibold ${size === s.size ? 'border-accent bg-accent text-black' : 'border-line hover:border-neutral-500'} ${out ? 'cursor-not-allowed text-neutral-600 line-through' : ''}`}>{s.size}</button>
            </div>
          );
        })}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-neutral-300"><span className="text-accent" aria-hidden>◔</span>{p.fitNote}</p>
      <p className="mt-1.5 flex items-center gap-2 text-xs text-neutral-300"><span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />{p.stockNote}</p>

      <div className="mt-5 flex gap-2">
        <button onClick={add} disabled={firstOpen === undefined} className="btn-cobalt flex-1 py-4">Add to bag • {naira(p.price)}</button>
        <button onClick={() => wl.toggle(p.slug)} aria-pressed={wish} aria-label="Save to wishlist" className={`btn-line !px-4 ${wish ? 'text-accent' : ''}`}><Heart filled={wish} /></button>
      </div>

      <div className="mt-4 flex gap-3 bg-panel p-4">
        <span className="text-accent"><Store /></span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Kurudu Abuja flagship pickup</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">Pay online via Paystack or select “Pay at Store” with complimentary 2-hour immediate pickup at {config?.pickup || 'Kurudu, Abuja FCT'}.</p>
        </div>
      </div>

      <div className="mt-6"><Accordion items={p.accordions} /></div>

      {guide && p.sizeChart && (
        <div role="dialog" aria-modal="true" aria-label="Size guide" className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setGuide(false)}>
          <div className="w-full max-w-md bg-panel p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between"><h2 className="display text-lg">Size guide</h2><button onClick={() => setGuide(false)} aria-label="Close"><Close /></button></div>
            <table className="mt-4 w-full text-left text-sm">
              <thead><tr className="label">{p.sizeChart.columns.map((c) => <th key={c} className="py-2 font-semibold">{c}</th>)}</tr></thead>
              <tbody>{p.sizeChart.rows.map((r) => <tr key={r[0]} className="border-t border-line">{r.map((c, i) => <td key={i} className="py-2">{c}</td>)}</tr>)}</tbody>
            </table>
            <p className="mt-3 text-xs text-muted">All measurements in {p.sizeChart.unit}.</p>
          </div>
        </div>
      )}
    </div>
  );
}
