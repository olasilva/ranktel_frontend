import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart, useWishlist } from '../CartContext.jsx';
import { NAV } from '../data.js';
import { Search, Heart, Bag } from './Icons.jsx';
import { useAuth } from '../AuthContext.jsx';
export default function Header({ onBag }) {
  const { count } = useCart();
  const wish = useWishlist();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const link = ({ isActive }) => `text-[11px] font-semibold uppercase tracking-[0.2em] ${isActive ? 'border-b border-accent pb-1 text-accent' : 'text-neutral-300 hover:text-white'}`;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link to="/" className="font-display text-xl font-extrabold tracking-wide transition-transform duration-300 hover:scale-105" aria-label="Ranktel home">RANK<span className="text-lav">TEL</span></Link>
        <nav className="nav-water hidden gap-7 md:flex" aria-label="Main">
          {NAV.map(([n, to]) => <NavLink key={n} to={to} end={to === '/'} className={link}>{n}</NavLink>)}
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="hover:text-accent"><Search /></button>
          <Link to="/account" aria-label={user ? 'Your account' : 'Sign in'} className="hidden text-[11px] font-bold uppercase tracking-widest hover:text-accent sm:block">{user ? (user.name?.split(' ')[0] || 'Account') : 'Sign in'}</Link>
          <span className="relative hidden sm:block" title="Wishlist">
            <Heart filled={wish.slugs.length > 0} />
            {wish.slugs.length > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-sm bg-accent px-1 text-[10px] font-bold text-black">{wish.slugs.length}</span>}
          </span>
          <button aria-label={`Bag, ${count} items`} onClick={onBag} className="relative hover:text-accent">
            <Bag />
            {count > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-sm bg-cobalt px-1 text-[10px] font-bold text-white">{count}</span>}
          </button>
          <span className="hidden h-7 w-7 rounded-full bg-accent sm:block" aria-hidden />
          <button className="btn-line !px-3 !py-1.5 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Close' : 'Menu'}</button>
        </div>
      </div>
      {open && <nav className="nav-water reveal-up wrap flex flex-col gap-3 pb-4 md:hidden" aria-label="Mobile">{NAV.map(([n, to], i) => <NavLink key={n} to={to} end={to === '/'} onClick={() => setOpen(false)} style={{ animationDelay: `${i * 60}ms` }} className={`${link} reveal-up`}>{n}</NavLink>)}</nav>}
    </header>
  );
}
