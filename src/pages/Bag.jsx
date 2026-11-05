import { Link } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import { naira } from '../format.js';
import Photo from '../components/Photo.jsx';

const FREE_DELIVERY = 160000;

export default function Bag() {
  const cart = useCart();
  const remaining = Math.max(0, FREE_DELIVERY - cart.subtotal);
  const progress = Math.min(100, (cart.subtotal / FREE_DELIVERY) * 100);

  return (
    <main className="wrap py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Order bag // Lagos 04</p>
          <h1 className="display mt-3 text-4xl sm:text-6xl">Your shopping bag <span className="text-lg text-muted">({cart.count} items)</span></h1>
        </div>
        <Link className="btn-line" to="/clothing">Continue shopping</Link>
      </div>

      {cart.items.length > 0 && (
        <section className="mt-10 border border-line bg-panel2 p-5">
          <div className="flex flex-wrap justify-between gap-3 text-sm">
            <p>{remaining ? <>Add <b className="text-accent">{naira(remaining)}</b> more for free express delivery across Nigeria.</> : <b className="text-emerald-400">You have unlocked free express delivery.</b>}</p>
            <span className="label">{naira(cart.subtotal)} / {naira(FREE_DELIVERY)}</span>
          </div>
          <div className="mt-3 h-1.5 bg-line"><div className="h-full bg-gradient-to-r from-accent to-orange-300" style={{ width: `${progress}%` }} /></div>
        </section>
      )}

      {cart.items.length === 0 ? (
        <div className="border border-line bg-panel p-12 text-center">
          <p className="eyebrow">Your bag is ready</p>
          <h2 className="display mt-3 text-3xl">Nothing reserved yet.</h2>
          <Link className="btn-cobalt mt-7" to="/new-arrivals">Explore new arrivals</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li key={`${item.slug}|${item.color}|${item.size}`} className="flex gap-4 border border-line bg-panel p-4 sm:p-6">
                <Photo img={item.img} alt={item.name} className="h-32 w-24 shrink-0 sm:h-40 sm:w-32" />
                <div className="min-w-0 flex-1">
                  <p className="label">{item.colorLabel} / {item.sizeLabel} {item.size}</p>
                  <h2 className="mt-2 font-display text-xl font-bold">{item.name}</h2>
                  <p className="mt-3 text-lg font-semibold">{naira(item.price)}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center border border-line">
                      <button className="px-3 py-2" onClick={() => cart.setQty(item, item.qty - 1)} aria-label="Decrease quantity">−</button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button className="px-3 py-2" onClick={() => cart.setQty(item, item.qty + 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button className="text-muted underline hover:text-white" onClick={() => cart.remove(item)}>Remove</button>
                  </div>
                </div>
                <p className="font-semibold">{naira(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>
          <aside className="h-fit border border-line bg-panel p-6">
            <p className="label">Bag summary</p>
            <div className="mt-5 flex justify-between text-sm"><span className="text-muted">Subtotal</span><b>{naira(cart.subtotal)}</b></div>
            <div className="mt-3 flex justify-between text-sm"><span className="text-muted">Delivery</span><span>{remaining ? 'Calculated at checkout' : 'Complimentary'}</span></div>
            <div className="mt-5 border-t border-line pt-5 flex justify-between"><span>Total</span><b className="text-xl">{naira(cart.subtotal)}</b></div>
            <Link className="btn-cobalt mt-6 w-full py-4" to="/checkout">Proceed to checkout</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
