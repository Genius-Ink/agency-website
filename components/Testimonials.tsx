import { testimonials, type Testimonial } from "@/lib/testimonials";

const COLORS = ["#F1BA55", "#EC3A48", "#2EB3C9", "#A5216A"];
const INKS = ["#0B0D10", "#FFFFFF", "#0B0D10", "#FFFFFF"];

function initials(name: string) {
  const clean = name.replace(/[[\]]/g, "").trim();
  return clean.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";
}

function Card({ t, i }: { t: Testimonial; i: number }) {
  const c = i % COLORS.length;
  return (
    <figure className="tcard">
      {t.placeholder ? <span className="tsample">Sample — replace</span> : null}
      <span className="tquote" aria-hidden="true">“</span>
      <blockquote>{t.quote}</blockquote>
      <figcaption>
        <span className="tav" style={{ background: COLORS[c], color: INKS[c] }} aria-hidden="true">{initials(t.name)}</span>
        <span className="twho">
          {t.link ? <a href={t.link} target="_blank" rel="noopener"><b>{t.name}</b></a> : <b>{t.name}</b>}
          <small>{t.role}</small>
        </span>
        {t.service ? <span className="tservice">{t.service}</span> : null}
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  const showSamples = process.env.NODE_ENV !== "production";
  const items = testimonials.filter((t) => showSamples || !t.placeholder);
  if (items.length === 0) return null;

  // Repeat the cards so the moving rows always look full, even with only a few testimonials.
  const reps = Math.max(2, Math.ceil(8 / items.length));
  const row = Array.from({ length: reps }, () => items).flat();
  const half = Math.ceil(items.length / 2);
  const row2Base = [...items.slice(half), ...items.slice(0, half)];
  const row2 = Array.from({ length: reps }, () => row2Base).flat();

  return (
    <section id="testimonials" className="tsec">
      <div className="container">
        <div className="section-head rv">
          <div>
            <p className="eyebrow"><b>04</b>Client testimonials</p>
            <h2 className="h2">Real impact.<br />Real growth.<br /><span style={{ color: "var(--accent)" }}>Proven results.</span></h2>
          </div>
          <p>How our websites, event platforms, video and AI work help clients get noticed, serve their customers and grow.</p>
        </div>
      </div>

      {/* Accessible static list for screen readers; the moving rows below are decorative duplicates */}
      <ul className="sr-only">
        {items.map((t, i) => (
          <li key={i}>“{t.quote}” — {t.name}, {t.role}</li>
        ))}
      </ul>

      <div className="tstrip" aria-hidden="true">
        <div className="trow">
          {[...row, ...row].map((t, i) => <Card key={i} t={t} i={i} />)}
        </div>
        {items.length > 1 ? (
          <div className="trow rev">
            {[...row2, ...row2].map((t, i) => <Card key={i} t={t} i={i + 1} />)}
          </div>
        ) : null}
      </div>
    </section>
  );
}
