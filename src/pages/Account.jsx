import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { getMyOrders, getReferral } from '../api.js';
import { naira } from '../format.js';

const TRACKING_STEPS = [
  { status: 'paid', label: 'Order placed', detail: 'Your payment has been received.' },
  { status: 'ready_for_pickup', label: 'Being prepared', detail: 'Your order is being prepared for dispatch or pickup.' },
  { status: 'shipped', label: 'On the way', detail: 'Your order has left Ranktel and is on its way.' },
  { status: 'completed', label: 'Delivered', detail: 'Your order has been completed.' },
];

const statusLabel = (status) => status.replaceAll('_', ' ');

function OrderTracker({ order }) {
  const isCancelled = order.status === 'cancelled';
  const currentIndex = TRACKING_STEPS.findIndex(({ status }) => status === order.status);
  const progressIndex = currentIndex === -1 && order.status === 'pending_payment' ? -1 : currentIndex;

  return (
    <div className="mt-5 border border-line bg-panel2 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label">Tracking order</p>
          <h3 className="mt-2 text-lg font-bold">{order.orderNo}</h3>
        </div>
        <span className={`text-xs font-bold uppercase ${isCancelled ? 'text-rose-400' : 'text-accent'}`}>
          {statusLabel(order.status)}
        </span>
      </div>

      {isCancelled ? (
        <p className="mt-5 border-l-2 border-rose-400 pl-3 text-sm text-muted">
          This order was cancelled. Contact us if you need help with your order.
        </p>
      ) : (
        <ol className="mt-6 grid gap-5 sm:grid-cols-4">
          {TRACKING_STEPS.map((step, index) => {
            const complete = progressIndex >= index;
            const current = progressIndex === index;
            return (
              <li key={step.status} className="relative">
                {index < TRACKING_STEPS.length - 1 && <span className={`absolute left-3 top-3 hidden h-px w-[calc(100%-1rem)] sm:block ${progressIndex > index ? 'bg-accent' : 'bg-line'}`} />}
                <div className="relative flex gap-3 sm:block">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${complete ? 'border-accent bg-accent text-ink' : 'border-line text-muted'}`}>
                    {complete ? '✓' : index + 1}
                  </span>
                  <div className="sm:mt-3">
                    <p className={`text-sm font-semibold ${current ? 'text-accent' : complete ? 'text-white' : 'text-muted'}`}>{step.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{current ? step.detail : complete ? 'Completed' : 'Not started'}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-6 grid gap-3 border-t border-line pt-4 text-xs text-muted sm:grid-cols-2">
        <p>Tracking ID: <b className="text-neutral-200">{order.trackingId || 'Assigned when dispatched'}</b></p>
        <p className="sm:text-right">Total: <b className="text-neutral-200">{naira(order.total)}</b></p>
      </div>
    </div>
  );
}

export default function Account() {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [referral, setReferral] = useState(null);
  const [error, setError] = useState('');
  const loadAccount = () => Promise.all([getMyOrders(), getReferral()])
    .then(([orderData, referralData]) => {
      setOrders(orderData.orders);
      setSelectedOrder((current) => orderData.orders.find((order) => order.orderNo === current?.orderNo) || orderData.orders[0] || null);
      setReferral(referralData);
    });
  useEffect(() => {
    loadAccount().catch((e) => setError(e.message));
  }, []);
  return (
    <main className="wrap min-h-[calc(100vh-10rem)] py-16">
      <p className="eyebrow">Your Ranktel</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
        <div><h1 className="display text-4xl sm:text-5xl">Account</h1><p className="mt-3 text-sm text-muted">{user?.email}</p></div>
        <div className="flex gap-2"><Link className="btn-line" to="/favorites">Favorites</Link><button className="btn-line" onClick={signOut}>Sign out</button></div>
      </div>
      {error && <p role="alert" className="mt-8 text-sm text-rose-400">{error}</p>}
      <section className="mt-12 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="border border-line bg-panel p-6">
          <p className="label">Orders &amp; tracking</p>
          <h2 className="mt-3 text-xl font-bold">Your orders</h2>
          {orders.length === 0 ? <p className="mt-2 text-sm text-muted">Your order history will appear here as you shop.</p> : (
            <>
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {orders.map((order) => (
                  <button
                    key={order.id || order.orderNo}
                    className={`shrink-0 border px-3 py-2 text-left text-xs transition ${selectedOrder?.orderNo === order.orderNo ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-accent'}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <b className="block text-white">{order.orderNo}</b>
                    <span className="mt-1 block uppercase">{statusLabel(order.status)}</span>
                  </button>
                ))}
              </div>
              {selectedOrder && <OrderTracker order={selectedOrder} />}
              {selectedOrder?.items?.length > 0 && <p className="mt-4 text-xs text-muted">{selectedOrder.items.map((item) => `${item.name} × ${item.qty}`).join(', ')}</p>}
            </>
          )}
          <button className="mt-5 text-xs text-accent underline" onClick={() => { setError(''); loadAccount().catch((e) => setError(e.message)); }}>Refresh tracking</button>
          <Link className="mt-5 inline-block text-sm text-accent hover:underline" to="/">Continue shopping →</Link>
        </div>
        <div className="space-y-4">
          <div className="border border-line bg-panel p-6"><p className="label">Refer &amp; earn</p><h2 className="mt-3 text-xl font-bold">Share Ranktel</h2><p className="mt-2 text-sm text-muted">Share your referral code with a friend. Rewards are credited when their first order is paid.</p><div className="mt-4 flex items-center justify-between gap-3 border border-line bg-panel2 p-3"><code className="text-accent">{referral?.code || 'Loading…'}</code><button className="text-xs underline" onClick={() => navigator.clipboard?.writeText(referral?.code || '')}>Copy</button></div><p className="mt-3 text-xs text-muted">{referral?.completed || 0} successful referrals · {naira(referral?.earned || 0)} earned</p></div>
          <div className="border border-line bg-panel p-6"><p className="label">Profile</p><h2 className="mt-3 text-xl font-bold">{user?.name || 'Ranktel member'}</h2><p className="mt-2 text-sm text-muted">{user?.email}</p></div>
        </div>
      </section>
    </main>
  );
}
