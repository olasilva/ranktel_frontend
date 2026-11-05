import { useEffect, useState } from 'react';
import { getCatalog } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function NewArrivals() {
  const [state, setState] = useState({ loading: true, error: '', items: [] });
  useEffect(() => {
    getCatalog({ sort: 'newest', page: 1, limit: 12 })
      .then((result) => setState({ loading: false, error: '', items: result.items }))
      .catch((error) => setState({ loading: false, error: error.message, items: [] }));
  }, []);
  return <main className="wrap py-12 sm:py-16">
    <nav className="label">Home / New arrivals / <span className="text-accent">Drop 04 — Nocturne Transit</span></nav>
    <p className="eyebrow mt-12">Seasonal capsule deployment</p><h1 className="display mt-4 text-5xl sm:text-7xl">New arrivals<span className="text-accent">.</span><br /><span className="text-muted">Drop 04</span></h1>
    <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">Limited seasonal artifacts engineered between Kurudu Atelier Abuja and nocturnal Lagos corridors.</p>
    {state.error && <p role="alert" className="mt-10 text-sm text-rose-400">{state.error}</p>}
    {state.loading ? <p className="py-20 text-center text-sm text-muted">Loading the latest drop…</p> : <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">{state.items.map((item) => <ProductCard key={item.slug} it={item} />)}</div>}
  </main>;
}
