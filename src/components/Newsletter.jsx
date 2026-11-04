import { useState } from 'react';
import { subscribe } from '../api.js';
import Photo from './Photo.jsx';
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [st, setSt] = useState({ s: 'idle', m: '' });
  async function submit(e) {
    e.preventDefault(); setSt({ s: 'loading', m: '' });
    try { const r = await subscribe(email); setEmail(''); setSt({ s: 'ok', m: r.message }); } catch (err) { setSt({ s: 'error', m: err.message }); }
  }
  return (
    <section className="relative mt-4">
      <Photo img="newsletter.jpg" className="absolute inset-0" />
      <div className="absolute inset-0 bg-black/70" />
      <div className="wrap relative py-20 text-center">
        <p className="label !text-accent">Join the inner circle</p>
        <h2 className="display mx-auto mt-4 max-w-2xl text-3xl sm:text-5xl">Get 10% off<br />your first order</h2>
        <p className="mt-4 text-sm text-neutral-300">New drops, private access and Ranktel stories. No noise.</p>
        <form onSubmit={submit} className="mx-auto mt-7 flex max-w-md" noValidate>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" className="field flex-1 !bg-white !text-black placeholder:!text-neutral-500" />
          <button className="btn-cobalt" disabled={st.s === 'loading'}>{st.s === 'loading' ? 'Joining…' : 'Join now →'}</button>
        </form>
        {st.m && <p role="status" className={`mt-3 text-sm ${st.s === 'ok' ? 'text-emerald-400' : 'text-rose-400'}`}>{st.m}</p>}
        <p className="mt-3 text-[10px] text-muted">By subscribing, you agree to our privacy policy.</p>
      </div>
    </section>
  );
}
