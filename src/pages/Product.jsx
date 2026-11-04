import { useEffect, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { getProduct } from '../api.js';
import Gallery from '../components/Gallery.jsx';
import BuyBox from '../components/BuyBox.jsx';
import Story from '../components/Story.jsx';
import Appraisals from '../components/Appraisals.jsx';
import ProductRow from '../components/ProductRow.jsx';

export default function Product() {
  const { slug } = useParams();
  const { openBag } = useOutletContext();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const load = () => { setData(null); setError(''); getProduct(slug).then(setData).catch((e) => setError(e.message)); };
  useEffect(load, [slug]);

  useEffect(() => { if (data) document.title = `${data.product.name} | Ranktel`; }, [data]);

  if (error) return (
    <div className="wrap py-32 text-center"><p className="text-muted">{error}</p><div className="mt-4 flex justify-center gap-3"><button className="btn-line" onClick={load}>Try again</button><Link to="/clothing" className="btn-cobalt">Browse clothing</Link></div></div>
  );
  if (!data) return <div className="wrap py-40 text-center text-sm text-muted">Loading…</div>;
  const { product: p, reviews, related, config } = data;
  return (
    <main>
      <section className="wrap grid gap-8 py-8 lg:grid-cols-[1fr_380px]">
        <Gallery key={p.slug} images={p.images} alt={p.name} />
        <BuyBox key={p.slug} p={p} config={config} onAdded={openBag} />
      </section>
      {p.story && <Story s={p.story} />}
      {p.stats && <Appraisals p={p} reviews={reviews} />}
      {related.look && <ProductRow id="look" eyebrow="Curated wardrobe" title="Complete the look" aside="Style formula: 04 denim core" items={related.look} />}
      {related.alike && <ProductRow id="alike" eyebrow={related.look ? 'Discover alternatives' : 'More from this collection'} title="You may also like" aside="View all →" items={related.alike} dark />}
    </main>
  );
}
