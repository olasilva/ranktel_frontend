import { useState } from 'react';
import { sendReview } from '../api.js';
import { timeAgo } from '../format.js';
import { Close } from './Icons.jsx';

export default function Appraisals({ p, reviews }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="wrap py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Verified community</p>
          <h2 className="display mt-3 text-3xl">Client appraisals</h2>
          <p className="mt-2 max-w-md text-sm text-muted">Aggregated evaluations from verified buyers in Lagos, Abuja, and Port Harcourt.</p>
        </div>
        <div className="flex items-center gap-5">
          <div><span className="font-display text-5xl font-extrabold">{p.rating}</span><span className="ml-2 text-accent" aria-hidden>★★★★★</span><p className="label">{p.reviewCount} independent reviews</p></div>
          <button className="btn-line" onClick={() => setOpen(true)}>Write appraisal</button>
        </div>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {p.stats.map((s) => (
          <div key={s.label} className="bg-panel p-4">
            <p className="label">{s.label}</p>
            <div className="mt-2 flex justify-between text-sm font-semibold"><span>{s.text}</span><span className={s.tone === 'lav' ? 'text-lav' : 'text-accent'}>{s.pct}%</span></div>
            <div className="mt-2 h-1 bg-line" role="img" aria-label={`${s.pct}%`}><div className={`h-full ${s.tone === 'lav' ? 'bg-lav' : 'bg-accent'}`} style={{ width: `${s.pct}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {reviews.slice(0, 3).map((r) => (
          <article key={r.id} className="flex flex-col bg-panel p-5">
            <div className="flex justify-between"><span className="text-accent" aria-label={`${r.rating} stars`}>{'★'.repeat(r.rating)}</span><span className="label">{timeAgo(r.createdAt)}</span></div>
            <h3 className="display mt-3 text-base">{r.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-300">“{r.body}”</p>
            <p className="mt-4 flex justify-between border-t border-line pt-3 text-[10px] font-semibold uppercase tracking-widest"><span>{r.name}{r.location ? `, ${r.location}` : ''}</span>{r.size && <span className="text-accent">Size {r.size}{r.verified ? ' (Verified)' : ''}</span>}</p>
          </article>
        ))}
      </div>
      {open && <ReviewForm onClose={() => setOpen(false)} />}
    </section>
  );
}

function ReviewForm({ onClose }) {
  const [f, setF] = useState({ name: '', location: '', size: '', rating: 5, title: '', body: '' });
  const [st, setSt] = useState({ s: 'idle', m: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setSt({ s: 'loading', m: '' });
    try { const r = await sendReview(f); setSt({ s: 'ok', m: r.message }); } catch (err) { setSt({ s: 'error', m: err.message }); }
  };
  return (
    <div role="dialog" aria-modal="true" aria-label="Write an appraisal" className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-3 bg-panel p-6">
        <div className="flex items-center justify-between"><h2 className="display text-lg">Write appraisal</h2><button type="button" onClick={onClose} aria-label="Close"><Close /></button></div>
        {st.s === 'ok' ? <p className="py-6 text-sm text-emerald-400">{st.m}</p> : (<>
          <div className="grid grid-cols-2 gap-3">
            <input required className="field" placeholder="Your name" value={f.name} onChange={set('name')} aria-label="Your name" />
            <input className="field" placeholder="City" value={f.location} onChange={set('location')} aria-label="City" />
            <input className="field" placeholder="Size bought" inputMode="numeric" value={f.size} onChange={set('size')} aria-label="Size bought" />
            <select className="field" value={f.rating} onChange={set('rating')} aria-label="Rating">{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
          </div>
          <input required className="field" placeholder="Headline" value={f.title} onChange={set('title')} aria-label="Headline" />
          <textarea required rows="4" className="field" placeholder="How do the fit and quality feel?" value={f.body} onChange={set('body')} aria-label="Your appraisal" />
          {st.s === 'error' && <p role="alert" className="text-sm text-rose-400">{st.m}</p>}
          <button className="btn-cobalt w-full" disabled={st.s === 'loading'}>{st.s === 'loading' ? 'Sending…' : 'Submit appraisal'}</button>
        </>)}
      </form>
    </div>
  );
}
