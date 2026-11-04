import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Auth({ create = false }) {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [state, setState] = useState({ busy: false, error: '' });
  if (user) return <Navigate to={location.state?.from || '/account'} replace />;
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    setState({ busy: true, error: '' });
    try {
      if (create) await signUp(form);
      else await signIn({ email: form.email, password: form.password });
      navigate(location.state?.from || '/account', { replace: true });
    } catch (error) {
      setState({ busy: false, error: error.message });
    }
  }
  return (
    <main className="wrap grid min-h-[calc(100vh-10rem)] items-center py-16">
      <div className="mx-auto w-full max-w-md">
        <p className="eyebrow">{create ? 'Join the collection' : 'Welcome back'}</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">{create ? 'Create account' : 'Sign in'}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{create ? 'Save your details and keep every Ranktel order close.' : 'Sign in to view your account and keep checkout moving.'}</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          {create && <input required className="field" placeholder="Full name" autoComplete="name" value={form.name} onChange={set('name')} />}
          <input required type="email" className="field" placeholder="Email address" autoComplete="email" value={form.email} onChange={set('email')} />
          <input required minLength="8" type="password" className="field" placeholder="Password (8+ characters)" autoComplete={create ? 'new-password' : 'current-password'} value={form.password} onChange={set('password')} />
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
