import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { getMyOrders, getReferral } from '../api.js';
import { naira } from '../format.js';

export default function Account() {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const [referral, setReferral] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([getMyOrders(), getReferral()])
      .then(([orderData, referralData]) => { setOrders(orderData.orders); setReferral(referralData); })
      .catch((e) => setError(e.message));
  }, []);
  return (
    <main className="wrap min-h-[calc(100vh-10rem)] py-16">
      <p className="eyebrow">Your Ranktel</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
        <div><h1 className="display text-4xl sm:text-5xl">Account</h1><p className="mt-3 text-sm text-muted">{user?.email}</p></div>
        <button className="btn-line" onClick={signOut}>Sign out</button>
      </div>
      {error && <p role="alert" className="mt-8 text-sm text-rose-400">{error}</p>}
      <section className="mt-12 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="border border-line bg-panel p-6">
          <p className="label">Orders &amp; tracking</p>
          <h2 className="mt-3 text-xl font-bold">Your orders</h2>
          {orders.length === 0 ? <p className="mt-2 text-sm text-muted">Your order history will appear here as you shop.</p> : (
            <ul className="mt-5 space-y-4">{orders.map((order) => (
              <li key={order.id || order.orderNo} className="border-t border-line pt-4 text-sm">
                <div className="flex flex-wrap justify-between gap-2"><b>{order.orderNo}</b><span className="uppercase text-accent">{order.status.replaceAll('_', ' ')}</span></div>
                <p className="mt-1 text-xs text-muted">Tracking ID: <b className="text-neutral-200">{order.trackingId}</b> · {naira(order.total)}</p>
                <p className="mt-2 text-xs text-muted">{order.items.map((item) => `${item.name} × ${item.qty}`).join(', ')}</p>
              </li>
            ))}</ul>
          )}
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
