import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useCart } from '../CartContext.jsx';
import { createOrder } from '../api.js';
import { naira } from '../format.js';

const blank = { name: '', phone: '', email: '', address: '', city: '' };

export default function Checkout() {
  const { user } = useAuth();
  const cart = useCart();
  const { config } = useOutletContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...blank, name: user?.name || '', email: user?.email || '' });
  const [delivery, setDelivery] = useState('pickup');
  const [payment, setPayment] = useState('paystack');
  const [state, setState] = useState({ busy: false, error: '' });

  useEffect(() => { if (user) setForm((current) => ({ ...current, name: user.name || current.name, email: user.email || current.email })); }, [user]);
  if (!user) return <Navigate to="/account" state={{ from: '/checkout' }} replace />;
  if (!cart.items.length) return <main className="wrap py-32 text-center"><h1 className="display text-4xl">Your bag is empty.</h1><Link className="btn-cobalt mt-7" to="/new-arrivals">Browse the collection</Link></main>;

  const fee = delivery === 'ship' ? config?.shippingFee || 0 : 0;
  const total = cart.subtotal + fee;
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    setState({ busy: true, error: '' });
    try {
      const result = await createOrder({ items: cart.items.map((item) => ({ slug: item.slug, color: item.color, size: item.size, qty: item.qty })), customer: form, delivery, payment });
      if (result.authorizationUrl) { window.location.href = result.authorizationUrl; return; }
      cart.clear();
      navigate('/order-confirmed', { state: { order: result }, replace: true });
    } catch (error) {
      setState({ busy: false, error: error.message });
    }
  }

  return (
    <main className="wrap grid gap-8 py-12 lg:grid-cols-[1fr_380px]">
      <form onSubmit={submit} className="border border-line bg-panel p-6 sm:p-10">
        <div className="flex items-center gap-3"><span className="bg-accent/10 px-2 py-1 text-xs font-bold text-accent">01</span><h1 className="display text-2xl">Contact protocol</h1></div>
        <p className="label mt-2">Dispatch verification</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="label sm:col-span-2">Full name<input required className="field mt-2" value={form.name} onChange={set('name')} autoComplete="name" /></label>
          <label className="label">Email address<input required type="email" className="field mt-2" value={form.email} onChange={set('email')} autoComplete="email" /></label>
          <label className="label">Mobile contact<input required className="field mt-2" value={form.phone} onChange={set('phone')} autoComplete="tel" /></label>
        </div>
        <fieldset className="mt-8 space-y-3"><legend className="label mb-3">Delivery method</legend>
          <Choice checked={delivery === 'pickup'} onChange={() => setDelivery('pickup')} title="Kurudu flagship pickup" sub="Complimentary • ready in 2 hours" />
          <Choice checked={delivery === 'ship'} onChange={() => setDelivery('ship')} title="Express nationwide dispatch" sub={config?.shippingFee ? naira(config.shippingFee) : 'Calculated by hub'} />
        </fieldset>
        {delivery === 'ship' && <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="label sm:col-span-2">Address<input required className="field mt-2" value={form.address} onChange={set('address')} autoComplete="street-address" /></label><label className="label">City<input required className="field mt-2" value={form.city} onChange={set('city')} /></label></div>}
        <fieldset className="mt-8 space-y-3"><legend className="label mb-3">Payment method</legend>
          <Choice checked={payment === 'paystack'} onChange={() => setPayment('paystack')} title="Pay online with Paystack" sub="Card, bank transfer, or USSD" disabled={config && !config.paystack} />
          <Choice checked={payment === 'store'} onChange={() => setPayment('store')} title="Pay at store" sub="Kurudu pickup only" disabled={delivery !== 'pickup'} />
        </fieldset>
        {state.error && <p role="alert" className="mt-5 text-sm text-rose-400">{state.error}</p>}
        <button className="btn-cobalt mt-8 w-full py-4" disabled={state.busy}>{state.busy ? 'Preparing order…' : `Confirm order • ${naira(total)}`}</button>
      </form>
      <aside className="h-fit border border-line bg-panel p-6"><p className="label">Order summary</p><ul className="mt-5 space-y-4">{cart.items.map((item) => <li key={`${item.slug}|${item.color}|${item.size}`} className="flex justify-between gap-3 text-sm"><span>{item.name} × {item.qty}</span><b>{naira(item.price * item.qty)}</b></li>)}</ul><div className="mt-6 border-t border-line pt-5 flex justify-between"><span>Total</span><b>{naira(total)}</b></div><Link className="mt-5 inline-block text-xs text-accent underline" to="/bag">Return to bag</Link></aside>
    </main>
  );
}

function Choice({ checked, onChange, title, sub, disabled = false }) {
  return <label className={`flex gap-3 border p-4 ${checked ? 'border-accent bg-accent/5' : 'border-line'} ${disabled ? 'opacity-40' : 'cursor-pointer'}`}><input type="radio" checked={checked} onChange={onChange} disabled={disabled} /> <span><b className="block text-sm">{title}</b><small className="mt-1 block text-muted">{sub}</small></span></label>;
}
