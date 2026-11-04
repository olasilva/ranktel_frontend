import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCatalog } from '../api.js';
import { CATS } from '../data.js';
import Photo from '../components/Photo.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Close } from '../components/Icons.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';

const SORTS = [['newest', 'Newest drops'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low']];

export default function Collection({ category }) {
  const meta = CATS[category];
  const [sp, setSp] = useSearchParams();
  const sub = sp.get('sub') || '';
  const [inStock, setInStock] = useState(true);
  const [unisex, setUnisex] = useState(true); // every Ranktel piece is unisex; the chip is informational
  const [sort, setSort] = useState('newest');
  const [panel, setPanel] = useState(false);
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [items, setItems] = useState([]);
  const [info, setInfo] = useState({ total: 0, categoryTotal: 0, pages: 1, subs: [] });
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => { setPage(1); }, [sub, inStock, sort]);
  useEffect(() => {
    let live = true;
    setState({ loading: true, error: '' });
    getCatalog({ category, sub, sort, page, limit: 8, ...(inStock ? { inStock: 1 } : {}) })
      .then((r) => { if (!live) return; setItems((cur) => (r.page === 1 ? r.items : [...cur, ...r.items])); setInfo(r); setState({ loading: false, error: '' }); })
      .catch((e) => live && setState({ loading: false, error: e.message }));
    return () => { live = false; };
  }, [category, sub, inStock, sort, page, tick]);
  useEffect(() => { document.title = `${meta.title} | Ranktel`; }, [meta]);

  const activeCount = (inStock ? 1 : 0) + (unisex ? 1 : 0);
  const clear = () => { setInStock(false); setUnisex(false); };
  const setSub = (id) => { const n = new URLSearchParams(sp); id ? n.set('sub', id) : n.delete('sub'); setSp(n); };
  const subLabel = info.subs.find((s) => s.id === sub)?.label || meta.all;
  const chip = (on) => `px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] ${on ? 'bg-cobalt text-white' : 'border border-line bg-panel text-neutral-300 hover:text-white'}`;

  return (
    <main>
      <section className="relative min-h-[300px] overflow-hidden border-b border-line">
        {meta.hero ? <Photo img={meta.hero} className="absolute inset-0" /> : <div className="absolute inset-0 bg-[radial-gradient(60rem_20rem_at_0%_30%,#14204f,transparent)]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="wrap relative flex min-h-[300px] flex-col justify-end pb-8 pt-24">
          <nav aria-label="Breadcrumb" className="label flex gap-2"><Link to="/" className="hover:text-white">Home</Link>/<span>{meta.crumb}</span>/<span className="text-accent">{subLabel}</span></nav>
          <h1 className="display mt-4 max-w-2xl text-4xl sm:text-5xl">{meta.title}</h1>
        </div>
      </section>

      <div className="wrap pt-8">
        {info.subs.length > 0 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Sub-categories">
            <button className={chip(!sub)} aria-pressed={!sub} onClick={() => setSub('')}>All ({info.categoryTotal})</button>
            {info.subs.map((s) => <button key={s.id} className={chip(sub === s.id)} aria-pressed={sub === s.id} onClick={() => setSub(s.id)}>{s.label}</button>)}
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          <button className="btn-line !px-3 !py-2" aria-expanded={panel} onClick={() => setPanel(!panel)}>Filter &amp; sort <span className="ml-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-[9px] text-black">{activeCount}</span></button>
          {inStock && <Active onClose={() => setInStock(false)}><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" />In stock</Active>}
          {unisex && <Active onClose={() => setUnisex(false)}>Unisex</Active>}
          {activeCount > 0 && <button className="label underline hover:text-white" onClick={clear}>Clear all</button>}
          <span className="label ml-auto hidden sm:block">{info.total} pieces catalogued</span>
          <label className="sr-only" htmlFor="sort">Sort</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="field !w-auto !py-2 text-xs font-bold uppercase tracking-wider">{SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        </div>
        {panel && (
          <div className="mt-3 flex flex-wrap gap-6 bg-panel p-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#ff7a1a]" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />In stock only</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#ff7a1a]" checked={unisex} onChange={(e) => setUnisex(e.target.checked)} />Unisex</label>
          </div>
        )}

        {state.error && <div className="py-20 text-center"><p className="text-muted">{state.error}</p><button className="btn-line mt-4" onClick={() => setTick((t) => t + 1)}>Try again</button></div>}
        {!state.error && !state.loading && items.length === 0 && (
          <div className="py-24 text-center"><p className="text-muted">No pieces match these filters.</p><button className="btn-line mt-4" onClick={clear}>Clear filters</button></div>
        )}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">{items.map((it, i) => <ScrollReveal key={it.slug} delay={i * 70}><ProductCard it={it} /></ScrollReveal>)}</div>
        {state.loading && <p className="py-10 text-center text-sm text-muted">Loading…</p>}
        {!state.loading && info.page < info.pages && (
          <div className="py-12 text-center"><button className="btn-line !border-cobalt !px-10" onClick={() => setPage(info.page + 1)}>{meta.loadMore}</button></div>
        )}
        <div className="pb-14" />
      </div>
    </main>
  );
}

function Active({ children, onClose }) {
  return <span className="inline-flex items-center gap-2 border border-line px-3 py-2">{children}<button onClick={onClose} aria-label="Remove filter" className="text-muted hover:text-white"><Close /></button></span>;
}
