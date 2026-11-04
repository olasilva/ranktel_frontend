import { useState } from 'react';
import { Chevron } from './Icons.jsx';
export default function Accordion({ items }) {
  const [open, setOpen] = useState(-1);
  return (
    <div className="divide-y divide-line border-t border-line">
      {items.map((a, n) => (
        <div key={a.title}>
          <button className="flex w-full items-center justify-between py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em]" aria-expanded={open === n} onClick={() => setOpen(open === n ? -1 : n)}>
            {a.title}<Chevron open={open === n} />
          </button>
          {open === n && <p className="pb-4 text-sm leading-relaxed text-neutral-400">{a.body}</p>}
        </div>
      ))}
    </div>
  );
}
