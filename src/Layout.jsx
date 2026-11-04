import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { getConfig, verifyPayment } from './api.js';
import { useCart } from './CartContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BagDrawer from './components/BagDrawer.jsx';

export default function Layout() {
  const [bagOpen, setBagOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const [notice, setNotice] = useState(null);
  const { pathname } = useLocation();
  const cart = useCart();
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('checkout') !== '1') return;
    window.history.replaceState({}, '', window.location.pathname);
    setBagOpen(true);
  }, [pathname]);

  useEffect(() => { getConfig().then(setConfig).catch(() => {}); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  // Returning from Paystack: confirm the payment with the server.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('reference');
    if (!ref) return;
    window.history.replaceState({}, '', window.location.pathname);
    verifyPayment(ref)
      .then((r) => {
        if (r.status === 'paid') { cart.clear(); setNotice({ ok: true, text: `Payment received. Order ${r.orderNo} is confirmed${r.trackingId ? ` (tracking ${r.trackingId})` : ''}.` }); }
        else setNotice({ ok: false, text: `Order ${r.orderNo} is not paid yet. Your bag is still saved.` });
      })
      .catch((e) => setNotice({ ok: false, text: e.message }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header onBag={() => setBagOpen(true)} />
      {notice && (
        <div role="status" className={`${notice.ok ? 'bg-emerald-700' : 'bg-rose-700'} px-5 py-3 text-center text-sm`}>
          {notice.text} <button className="ml-3 underline" onClick={() => setNotice(null)}>Dismiss</button>
        </div>
      )}
      <div key={pathname} className="page-enter">
        <Outlet context={{ openBag: () => setBagOpen(true), config }} />
      </div>
      <Footer />
      <BagDrawer open={bagOpen} onClose={() => setBagOpen(false)} config={config} />
    </>
  );
}
