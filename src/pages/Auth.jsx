import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Auth({ create = false }) {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false });
  const [state, setState] = useState({ busy: false, error: '' });
  if (user) return <Navigate to={location.state?.from || '/account'} replace />;
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    setState({ busy: true, error: '' });
    try {
      if (create) {
        if (form.password !== form.confirmPassword) throw new Error('Passwords do not match.');
        if (!form.terms) throw new Error('Please accept the client terms to continue.');
        await signUp({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      }
      else await signIn({ email: form.email, password: form.password });
      navigate(location.state?.from || '/account', { replace: true });
    } catch (error) {
      setState({ busy: false, error: error.message });
    }
  }
  return (
    <main className="wrap grid min-h-[calc(100vh-10rem)] items-center py-12">
      <div className="mx-auto w-full max-w-2xl border border-line bg-panel p-6 sm:p-12">
        <p className="eyebrow">{create ? 'Client enrollment // Drop 04 access' : 'Atelier access // Client portal'}</p>
        <h1 className="display mt-4 text-4xl sm:text-5xl">{create ? 'Create your Ranktel account' : <>Welcome back to<br />the vault</>}</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{create ? 'Create a client profile for reserved silhouettes, fitting schedules, and private drop allocations.' : 'Sign in to access reserved silhouettes, Kurudu studio fitting schedules, and private drop allocations.'}</p>
        {create && <div className="mt-8 grid gap-3 border border-line bg-panel2 p-3 text-xs sm:grid-cols-2">
          <div><b className="block uppercase tracking-wider text-white">Welcome privilege</b><span className="text-muted">Automatic 10% code applied to Drop 04 releases.</span></div>
          <div><b className="block uppercase tracking-wider text-white">Kurudu VIP lounge</b><span className="text-muted">Complimentary fitting suite reservation included.</span></div>
        </div>}
        <form onSubmit={submit} className="mt-8 space-y-4">
          {create && <label className="label block">Full name<input required className="field mt-2" placeholder="Your full name" autoComplete="name" value={form.name} onChange={set('name')} /></label>}
          <label className="label block">Email<input required type="email" className="field mt-2" placeholder="client@ranktel.com" autoComplete="email" value={form.email} onChange={set('email')} /></label>
          {create && <label className="label block">Phone number<input required type="tel" className="field mt-2" placeholder="+234 800 000 0000" autoComplete="tel" value={form.phone} onChange={set('phone')} /></label>}
          <label className="label block">{create ? 'Master password' : 'Password'}<input required minLength="8" type="password" className="field mt-2" placeholder="8+ characters" autoComplete={create ? 'new-password' : 'current-password'} value={form.password} onChange={set('password')} /></label>
          {create && <label className="label block">Confirm password<input required minLength="8" type="password" className="field mt-2" placeholder="Repeat your password" autoComplete="new-password" value={form.confirmPassword} onChange={set('confirmPassword')} /></label>}
          {create && <label className="flex items-start gap-3 text-xs text-muted"><input required type="checkbox" className="mt-0.5 accent-[#ff7a1a]" checked={form.terms} onChange={(event) => setForm({ ...form, terms: event.target.checked })} /><span>I agree to the Ranktel client terms and privacy protocol.</span></label>}
          {state.error && <p role="alert" className="text-sm text-rose-400">{state.error}</p>}
          <button className="btn-cobalt w-full py-4" disabled={state.busy}>{state.busy ? 'Please wait…' : create ? 'Create account' : 'Sign in'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          {create ? 'Already have an account? ' : 'New to Ranktel? '}
          <Link className="text-accent hover:underline" to={create ? '/account' : '/account/create'}>{create ? 'Sign in' : 'Create one'}</Link>
        </p>
      </div>
    </main>
  );
}
