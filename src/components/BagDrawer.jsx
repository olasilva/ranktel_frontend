import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import { createOrder } from '../api.js';
import { naira } from '../format.js';
import Photo from './Photo.jsx';
import { Close } from './Icons.jsx';
import { useAuth } from '../AuthContext.jsx';

const blank = { name: '', phone: '', email: '', address: '', city: '' };

export default function BagDrawer({ open, onClose, config }) {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('bag'); // bag | checkout | done
  const [f, setF] = useState(blank);
  const [delivery, setDelivery] = useState('pickup');
  const [payment, setPayment] = useState('paystack');
  const [referralCode, setReferralCode] = useState('');
  const [st, setSt] = useState({ busy: false, err: '' });
  const [done, setDone] = useState(null);
  useEffect(() => {
    if (user?.email && !f.email) setF((current) => ({ ...current, name: user.name || current.name, email: user.email }));
  }, [user, f.email]);
  useEffect(() => {
    if (open && user && sessionStorage.getItem('ranktel-pending-checkout') === '1') {
      sessionStorage.removeItem('ranktel-pending-checkout');
      setStep('checkout');
    }
  }, [open, user]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const fee = delivery === 'ship' ? config?.shippingFee || 0 : 0;
  const total = cart.subtotal + fee;
  if (!open) return null;

  const close = () => { onClose(); if (step === 'done') setStep('bag'); };
  const pickDelivery = (d) => { setDelivery(d); if (d === 'ship') setPayment('paystack'); };

  async function submit(e) {
    e.preventDefault();
    setSt({ busy: true, err: '' });
    try {
      const res = await createOrder({
        items: cart.items.map((i) => ({ slug: i.slug, color: i.color, size: i.size, qty: i.qty })),
        customer: f, delivery, payment, referralCode,
      });
      if (res.authorizationUrl) { window.location.href = res.authorizationUrl; return; }
      cart.clear(); setDone(res); setStep('done'); setSt({ busy: false, err: '' });
    } catch (err) {
      setSt({ busy: false, err: err.message });
    }
  }

  return (
    <div className="backdrop-enter fixed inset-0 z-50 flex justify-end bg-black/70" onClick={close}>
      <aside role="dialog" aria-modal="true" aria-label="Shopping bag" className="drawer-enter flex h-full w-full max-w-md flex-col bg-panel" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="display text-lg">{step === 'checkout' ? 'Checkout' : step === 'done' ? 'Order placed' : `Your bag (${cart.count})`}</h2>
          <button onClick={close} aria-label="Close bag"><Close /></button>
        </div>

        {step === 'done' && done && (
          <div className="flex-1 p-6 text-sm leading-relaxed">
            <p className="text-lg font-bold text-emerald-400">Thank you.</p>
            <p className="mt-3">Order <b>{done.orderNo}</b> is reserved. Total to pay at the store: <b>{naira(done.total)}</b>.</p>
            <p className="mt-3 text-muted">We hold your size for 48 hours{done.holdUntil ? `, until ${new Date(done.holdUntil).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}` : ''}. Collect from our Kurudu, Abuja flagship and quote your order number at the desk.</p>
            <button className="btn-cobalt mt-6" onClick={close}>Continue shopping</button>
          </div>
        )}

        {step === 'bag' && (<>
          <div className="flex-1 overflow-y-auto p-5">
            {cart.items.length === 0 && <p className="py-16 text-center text-sm text-muted">Your bag is empty.</p>}
            <ul className="space-y-4">
              {cart.items.map((i) => (
                <li key={`${i.slug}${i.color}${i.size}`} className="flex gap-3">
                  <Photo img={i.img} className="h-24 w-20 shrink-0" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">{i.name}</p>
                    <p className="text-xs text-muted">{i.colorLabel} • {i.sizeLabel} {i.size}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border border-line">
                        <button className="px-2.5 py-1" aria-label="Decrease quantity" onClick={() => cart.setQty(i, i.qty - 1)}>−</button>
                        <span className="w-6 text-center text-xs">{i.qty}</span>
                        <button className="px-2.5 py-1" aria-label="Increase quantity" onClick={() => cart.setQty(i, i.qty + 1)}>+</button>
                      </div>
                      <button className="text-xs text-muted underline hover:text-white" onClick={() => cart.remove(i)}>Remove</button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{naira(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line p-5">
            <p className="mb-4 flex justify-between text-sm"><span className="text-muted">Subtotal</span><b>{naira(cart.subtotal)}</b></p>
            <button type="button" className="mb-3 w-full text-center text-xs text-accent underline" onClick={() => { onClose(); navigate('/bag'); }}>View full bag</button>
            <button className="btn-cobalt w-full py-4" disabled={!cart.items.length} onClick={() => {
              if (!user) {
                sessionStorage.setItem('ranktel-pending-checkout', '1');
                onClose();
                navigate('/account', { state: { from: '/?checkout=1' } });
                return;
              }
              setStep('checkout');
            }}>Checkout</button>
          </div>
        </>)}

        {step === 'checkout' && (
          <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex-1 space-y-4 p-5">
              <input required className="field" placeholder="Full name" autoComplete="name" value={f.name} onChange={set('name')} aria-label="Full name" />
              <div className="grid grid-cols-2 gap-3">
                <input required className="field" placeholder="Phone" autoComplete="tel" inputMode="tel" value={f.phone} onChange={set('phone')} aria-label="Phone" />
                <input required type="email" className="field" placeholder="Email" autoComplete="email" value={f.email} onChange={set('email')} aria-label="Email" />
              </div>
              <fieldset className="space-y-2"><legend className="label mb-2">Delivery</legend>
                <Choice checked={delivery === 'pickup'} onChange={() => pickDelivery('pickup')} title="Pickup at Kurudu, Abuja" sub="Free • ready in 2 hours" />
                <Choice checked={delivery === 'ship'} onChange={() => pickDelivery('ship')} title="Ship from Lagos Hub" sub={`${config?.shippingFee ? naira(config.shippingFee) : 'Free'} • ships within 24 hours`} />
              </fieldset>
              {delivery === 'ship' && (
                <div className="space-y-3">
                  <input required className="field" placeholder="Delivery address" autoComplete="street-address" value={f.address} onChange={set('address')} aria-label="Delivery address" />
                  <input required className="field" placeholder="City" autoComplete="address-level2" value={f.city} onChange={set('city')} aria-label="City" />
                </div>
              )}
              <input className="field" placeholder="Referral code (optional)" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
              <fieldset className="space-y-2"><legend className="label mb-2">Payment</legend>
                <Choice checked={payment === 'paystack'} onChange={() => setPayment('paystack')} title="Pay online with Paystack" sub="Card, bank transfer, USSD" disabled={config && !config.paystack} />
                <Choice checked={payment === 'store'} onChange={() => setPayment('store')} title="Pay at Store" sub="Kurudu pickup only" disabled={delivery !== 'pickup'} />
              </fieldset>
              {st.err && <p role="alert" className="text-sm text-rose-400">{st.err}</p>}
            </div>
            <div className="border-t border-line p-5">
              <p className="flex justify-between text-sm"><span className="text-muted">Delivery</span><span>{fee ? naira(fee) : 'Free'}</span></p>
              <p className="mt-1 flex justify-between text-base font-bold"><span>Total</span><span>{naira(total)}</span></p>
              <div className="mt-4 flex gap-2">
                <button type="button" className="btn-line" onClick={() => setStep('bag')}>Back</button>
                <button className="btn-cobalt flex-1" disabled={st.busy}>{st.busy ? 'Please wait…' : payment === 'paystack' ? `Pay ${naira(total)}` : 'Place order'}</button>
              </div>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}

function Choice({ checked, onChange, title, sub, disabled }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 border p-3 ${checked ? 'border-cobalt bg-panel2' : 'border-line'} ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}>
      <input type="radio" className="mt-1 accent-[#ff7a1a]" checked={checked} onChange={onChange} disabled={disabled} />
      <span><b className="block text-sm">{title}</b><span className="text-xs text-muted">{sub}</span></span>
    </label>
  );
}
