import { Link, useLocation } from 'react-router-dom';

export default function OrderConfirmed() {
  const { state } = useLocation();
  const order = state?.order;
  return <main className="wrap py-20 text-center sm:py-28">
    <p className="eyebrow">Lagos noir • curated drop fulfillment</p>
    <h1 className="display mx-auto mt-5 max-w-3xl text-4xl sm:text-6xl">Thank you, your order is confirmed.</h1>
    <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm"><span className="label">Order reference</span><strong className="bg-panel2 px-3 py-2">{order?.orderNo || 'Confirmation pending'}</strong></div>
    <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-muted">A digital receipt has been dispatched to your order email. We will follow up with pickup or dispatch details as soon as your order is prepared.</p>
    <div className="mt-10 flex justify-center gap-3"><Link className="btn-cobalt" to="/account">View account</Link><Link className="btn-line" to="/new-arrivals">Continue shopping</Link></div>
  </main>;
}
