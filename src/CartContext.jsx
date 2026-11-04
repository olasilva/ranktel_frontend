import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const Ctx = createContext(null);
const KEY = 'ranktel-bag';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable */ } }, [items]);
  const id = (i) => `${i.slug}|${i.color}|${i.size}`;
  const value = useMemo(() => ({
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
    add: (item) => setItems((cur) => {
      const f = cur.find((i) => id(i) === id(item));
      return f ? cur.map((i) => (id(i) === id(item) ? { ...i, qty: Math.min(i.qty + 1, 5) } : i)) : [...cur, { ...item, qty: 1 }];
    }),
    setQty: (item, qty) => setItems((cur) => cur.map((i) => (id(i) === id(item) ? { ...i, qty: Math.min(Math.max(qty, 1), 5) } : i))),
    remove: (item) => setItems((cur) => cur.filter((i) => id(i) !== id(item))),
    clear: () => setItems([]),
  }), [items]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);

const WCtx = createContext(null);
const WKEY = 'ranktel-wishlist';
export function WishlistProvider({ children }) {
  const [slugs, setSlugs] = useState(() => { try { return JSON.parse(localStorage.getItem(WKEY)) || []; } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(WKEY, JSON.stringify(slugs)); } catch { /* storage unavailable */ } }, [slugs]);
  const value = useMemo(() => ({ slugs, has: (s) => slugs.includes(s), toggle: (s) => setSlugs((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s])) }), [slugs]);
  return <WCtx.Provider value={value}>{children}</WCtx.Provider>;
}
export const useWishlist = () => useContext(WCtx);
