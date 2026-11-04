const p = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
export const Search = () => <svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const Heart = ({ filled }) => <svg {...p} fill={filled ? 'currentColor' : 'none'}><path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9Z" /></svg>;
export const Bag = () => <svg {...p}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>;
export const Expand = () => <svg {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>;
export const Chevron = ({ open }) => <svg {...p} style={{ transform: open ? 'rotate(180deg)' : 'none' }}><path d="m6 9 6 6 6-6" /></svg>;
export const Close = () => <svg {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const Store = () => <svg {...p}><path d="M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6" /></svg>;
