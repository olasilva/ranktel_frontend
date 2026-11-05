import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../CartContext.jsx';
import { getProduct } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Favorites() {
  const { slugs } = useWishlist();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    Promise.all(slugs.map((slug) => getProduct(slug).then(({ product }) => ({ slug: product.slug, name: product.name, price: product.price, img: product.images[0], kicker: product.eyebrow, colors: product.colors.map((c) => c.hex), meta: product.stockNote }))))
      .then((result) => active && setItems(result))
      .catch((e) => active && setError(e.message));
    return () => { active = false; };
  }, [slugs]);
  return <main className="wrap py-12 sm:py-16">
    <p className="eyebrow">Account / My favorites</p><h1 className="display mt-3 text-4xl sm:text-6xl">Your favorites <span className="text-lg text-accent">({slugs.length} pieces curated)</span></h1>
    <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">Saved silhouettes ready for immediate checkout or reserved priority fitting at the Kurudu flagship, Abuja.</p>
    {error && <p role="alert" className="mt-8 text-sm text-rose-400">{error}</p>}
    {!slugs.length ? <div className="mt-12 border border-line bg-panel p-12 text-center"><h2 className="display text-2xl">Your board is empty.</h2><Link className="btn-cobalt mt-6" to="/new-arrivals">Discover new arrivals</Link></div> : <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">{items.map((item) => <ProductCard key={item.slug} it={item} />)}</div>}
  </main>;
}
