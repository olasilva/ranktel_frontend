import { useEffect, useState } from 'react';
import { naira } from '../../format.js';
import {
  getAdminOrders, getAdminProducts, sendAdminMessage, updateAdminOrderStatus, updateAdminProduct,
} from '../../api.js';

const STATUSES = ['paid', 'ready_for_pickup', 'shipped', 'completed', 'cancelled'];

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem('ranktel-admin-key') || '');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState({ email: '', subject: '', body: '' });
  const [state, setState] = useState({ loading: false, error: '', notice: '' });

  const load = async () => {
    sessionStorage.setItem('ranktel-admin-key', key);
    setState({ loading: true, error: '', notice: '' });
    try {
      const [productData, orderData] = await Promise.all([getAdminProducts(), getAdminOrders()]);
      setProducts(productData);
      setOrders(orderData);
      setState({ loading: false, error: '', notice: '' });
    } catch (error) {
      setState({ loading: false, error: error.message, notice: '' });
    }
  };
  useEffect(() => { if (key) load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveProduct = async (event) => {
    event.preventDefault();
    try {
      const data = await updateAdminProduct(selected.slug, selected);
      setProducts((current) => current.map((product) => product.slug === selected.slug ? data.product : product));
      setSelected(null);
      setState((current) => ({ ...current, notice: 'Product updated.' }));
    } catch (error) { setState((current) => ({ ...current, error: error.message })); }
  };
  const acknowledge = async (orderNo, status) => {
    try {
      const data = await updateAdminOrderStatus(orderNo, status);
      setOrders((current) => current.map((order) => order.orderNo === orderNo ? data : order));
    } catch (error) { setState((current) => ({ ...current, error: error.message })); }
  };
  const send = async (event) => {
    event.preventDefault();
    try {
      await sendAdminMessage({ email: message.email, subject: message.subject, message: message.body });
      window.location.href = `mailto:${message.email}?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.body)}`;
      setMessage({ email: '', subject: '', body: '' });
      setState((current) => ({ ...current, notice: 'Message queued and email composer opened.' }));
    } catch (error) { setState((current) => ({ ...current, error: error.message })); }
  };

  if (!key || state.error === 'Unauthorized') return (
    <main className="wrap min-h-[calc(100vh-10rem)] py-16">
      <p className="eyebrow">Ranktel operations</p><h1 className="display mt-3 text-4xl">Admin sign in</h1>
      <form className="mt-8 flex max-w-md gap-2" onSubmit={(event) => { event.preventDefault(); load(); }}>
        <input required type="password" className="field" placeholder="Admin key" value={key} onChange={(event) => setKey(event.target.value)} />
        <button className="btn-cobalt">Enter</button>
      </form>
      {state.error && <p className="mt-4 text-sm text-rose-400">{state.error}</p>}
    </main>
  );

  return (
    <main className="wrap py-12">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Ranktel operations</p><h1 className="display mt-3 text-4xl">Admin control</h1></div><button className="btn-line" onClick={() => { sessionStorage.removeItem('ranktel-admin-key'); setKey(''); }}>Sign out</button></div>
      {state.notice && <p className="mt-5 text-sm text-emerald-400">{state.notice}</p>}
      {state.error && <p className="mt-5 text-sm text-rose-400">{state.error}</p>}
      <section className="mt-10"><p className="label">Products</p><div className="mt-3 overflow-x-auto border border-line"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-panel2 text-xs uppercase tracking-wider text-muted"><tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock state</th><th className="p-3" /></tr></thead><tbody>{products.map((product) => <tr key={product.slug} className="border-t border-line"><td className="p-3 font-semibold">{product.name}</td><td className="p-3 text-muted">{product.category}</td><td className="p-3">{naira(product.price)}</td><td className="p-3">{product.stock || 'in'}</td><td className="p-3 text-right"><button className="text-accent underline" onClick={() => setSelected({ ...product })}>Edit</button></td></tr>)}</tbody></table></div></section>
      {selected && <form onSubmit={saveProduct} className="mt-5 grid gap-3 border border-cobalt bg-panel p-5 sm:grid-cols-2"><h2 className="display text-xl sm:col-span-2">Edit {selected.name}</h2><input className="field" value={selected.name} onChange={(e) => setSelected({ ...selected, name: e.target.value })} /><input className="field" type="number" min="0" value={selected.price} onChange={(e) => setSelected({ ...selected, price: e.target.value })} /><input className="field" type="number" min="0" placeholder="Compare-at price" value={selected.compareAt || ''} onChange={(e) => setSelected({ ...selected, compareAt: e.target.value })} /><select className="field" value={selected.stock || 'in'} onChange={(e) => setSelected({ ...selected, stock: e.target.value })}><option value="in">In stock</option><option value="low">Low stock</option><option value="out">Out of stock</option></select><div className="flex gap-2 sm:col-span-2"><button className="btn-cobalt">Save product</button><button type="button" className="btn-line" onClick={() => setSelected(null)}>Cancel</button></div></form>}
      <section className="mt-12"><p className="label">Orders</p><div className="mt-3 space-y-3">{orders.map((order) => <div key={order.orderNo} className="border border-line bg-panel p-4"><div className="flex flex-wrap justify-between gap-3"><b>{order.orderNo}</b><select className="field !w-auto !py-1" value={order.status} onChange={(e) => acknowledge(order.orderNo, e.target.value)}>{order.status === 'pending_payment' && <option value="pending_payment">Pending payment</option>}{order.status === 'awaiting_store_payment' && <option value="awaiting_store_payment">Awaiting store payment</option>}{STATUSES.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select></div><p className="mt-2 text-xs text-muted">{order.customer?.email} · {order.trackingId} · {naira(order.total)}</p><button className="mt-3 text-xs text-accent underline" onClick={() => setMessage({ email: order.customer?.email || '', subject: `Update on order ${order.orderNo}`, body: `Hello ${order.customer?.name || 'there'},\n\nHere is an update on your Ranktel order ${order.orderNo} (${order.trackingId}).` })}>Contact customer</button></div>)}</div></section>
      <section className="mt-12 max-w-2xl"><p className="label">Customer outreach</p><form onSubmit={send} className="mt-3 space-y-3 border border-line bg-panel p-5"><input required type="email" className="field" placeholder="Customer email" value={message.email} onChange={(e) => setMessage({ ...message, email: e.target.value })} /><input required className="field" placeholder="Subject" value={message.subject} onChange={(e) => setMessage({ ...message, subject: e.target.value })} /><textarea required rows="5" className="field" placeholder="Message" value={message.body} onChange={(e) => setMessage({ ...message, body: e.target.value })} /><button className="btn-cobalt">Reach out to customer</button></form></section>
    </main>
  );
}
