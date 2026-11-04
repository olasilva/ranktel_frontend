const cols = [
  ['Company', ['About Ranktel', 'Stores in Kurudu Abuja', 'Careers', 'Sustainability']],
  ['Assistance', ['Track Order', 'Shipping & Delivery', 'Returns', 'Size Guide', 'Contact Us']],
  ['Legal', ['Privacy Policy', 'Terms of Service']],
];
export default function Footer() {
  return (
    <footer className="bg-foot pb-8 pt-14">
      <div className="wrap grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {cols.map(([h, links]) => (
          <div key={h}><h4 className="label mb-4">{h}</h4><ul className="space-y-2.5 text-sm text-neutral-300">{links.map((l) => <li key={l}><a href="/" className="hover:text-white">{l}</a></li>)}</ul></div>
        ))}
        <div>
          <h4 className="label mb-4">Verification &amp; origin</h4>
          <div className="bg-ink/40 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Kurudu store pickup</p><p className="mt-1 text-xs text-muted">Flagship physical collection available daily at Kurudu, Abuja FCT.</p></div>
          <p className="mt-3 flex flex-wrap gap-2">{['Paystack', 'Mastercard', 'Visa', 'Verve'].map((b) => <span key={b} className="border border-line px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-neutral-300">{b}</span>)}</p>
        </div>
      </div>
      <div className="wrap mt-12 flex flex-wrap justify-between gap-3 border-t border-line pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        <p className="flex gap-6"><a href="/">Instagram</a><a href="/">TikTok</a><a href="/">Journal</a></p>
        <p>© {new Date().getFullYear()} Ranktel Collection. All rights reserved.</p>
      </div>
    </footer>
  );
}
