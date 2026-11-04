import Photo from './Photo.jsx';
export default function Story({ s }) {
  return (
    <section className="border-y border-line bg-[#0f0f13] py-16">
      <div className="wrap grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">{s.title[0]}<br />{s.title[1]}<br />{s.title[2]}<br />{s.title[3]}</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">{s.body}</p>
          <dl className="mt-7 grid max-w-md grid-cols-2 gap-3">
            {s.stats.map((t, i) => (
              <div key={t.label} className="bg-panel p-4">
                <dt className={`font-display text-3xl font-extrabold ${i ? 'text-lav' : 'text-accent'}`}>{t.value}<span className="text-base">{t.unit}</span></dt>
                <dd className="label mt-1">{t.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {s.images.map((im) => (
            <Photo key={im.file} img={im.file} alt={im.caption} className="aspect-[3/4]">
              <span className="absolute bottom-3 left-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/80">{im.caption}</span>
            </Photo>
          ))}
        </div>
      </div>
    </section>
  );
}
