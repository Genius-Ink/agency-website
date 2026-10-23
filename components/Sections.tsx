import Countdown from "./Countdown";
import { EqBars, PlayIcon } from "./icons";

function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return <p className="eyebrow"><b>{n}</b>{children}</p>;
}

/* ---------------- marquee ---------------- */
const ROW1 = ["Website design", "Event technology", "Video & AI", "Google Maps presence", "Social media", "App scaling"];
const ROW2 = ["Motion design", "Brand animation", "Tech strategy", "Marketing", "Flutter apps", "Launch support"];

export function Marquee() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="mq">
        {[...ROW1, ...ROW1].map((t, i) => <span key={i} className={i % 2 ? "out" : "solid"}>{t} ✦</span>)}
      </div>
      <div className="mqr">
        {[...ROW2, ...ROW2].map((t, i) => <span key={i} className={i % 2 ? "acc" : "out"}>{t} ✦</span>)}
      </div>
    </div>
  );
}

/* ---------------- services ---------------- */
const SERVICES = [
  { t: "Website design & build", d: "Animated, mobile-first sites that explain what you do in seconds and turn visitors into enquiries." },
  { t: "Event technology", d: "Event sites with countdowns, speakers, agenda, ticketing and RSVP, and a tech partner on hand on the day." },
  { t: "Video, motion & AI", d: "Promo, recap and social video, animated brand intros and motion graphics, with AI to speed up production." },
  { t: "Business online & Google Maps", d: "Google Business profile, Maps listing, reviews and a marketing plan so local customers find you." },
  { t: "Social media marketing", d: "Content calendars, motion-first posts and community management on the platforms your customers use." },
  { t: "Apps & scaling", d: "Mobile and web apps built to grow: performance, cloud infrastructure and architecture that holds up." },
  { t: "AI integration & tech decisions", d: "AI assistants, automations and smart workflows fitted to how your business runs, plus honest advice before you spend on any tool.", feature: true },
];

export function Services() {
  return (
    <section id="services" className="paper">
      <div className="container section">
        <div className="section-head rv">
          <div>
            <Eyebrow n="01">Services</Eyebrow>
            <h2 className="h2">What we do</h2>
          </div>
          <p>One team for the whole digital picture, so your site, your event, your content and your growth all move in the same direction.</p>
        </div>
        <div className="cards">
          {SERVICES.map((s, i) => (
            <article key={s.t} className={"svc rv" + (s.feature ? " feature" : "")}>
              <div className="top"><span>{String(i + 1).padStart(2, "0")}</span><span className="arr" aria-hidden="true">↗</span></div>
              <div><h3>{s.t}</h3><p>{s.d}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- audience ---------------- */
const PEOPLE = [
  { t: "The local business owner", d: "Great at what you do, invisible online. You need a site, a Google Maps listing and steady social posts." },
  { t: "The event organiser", d: "Summit, conference or launch coming up. You need the site, tickets and a tech partner you can call on the day." },
  { t: "The founder with traction", d: "Your app works, users are growing and things are starting to creak. Time to scale it properly." },
  { t: "The creator or brand", d: "You have the story. You need video, motion and AI workflows that make content faster to produce." },
];

export function Audience() {
  return (
    <section aria-labelledby="fit" className="container" style={{ paddingTop: 112, paddingBottom: 40 }}>
      <div className="rv" style={{ marginBottom: 48 }}>
        <Eyebrow n="02">Who we work with</Eyebrow>
        <h2 id="fit" className="h2">Is this you?</h2>
      </div>
      <div className="cards">
        {PEOPLE.map((p, i) => (
          <article key={p.t} className="per rv">
            <p className="num">{String(i + 1).padStart(2, "0")}</p>
            <h3>{p.t}</h3>
            <p>{p.d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- work ---------------- */
export function Work() {
  return (
    <section id="work" className="container section">
      <div className="section-head rv">
        <div>
          <Eyebrow n="03">Selected work</Eyebrow>
          <h2 className="h2">Recent work</h2>
        </div>
        <p>From a pan-African tech summit to open-source software used by developers worldwide.</p>
      </div>

      <article className="wk wk-feature rv">
        <div className="art">
          <div className="viz">
            <div aria-hidden="true" className="ring r1" style={{ right: -120, bottom: -160, width: 380, height: 380, border: "1px dashed #5B3A85" }} />
            <p className="summit-date">27–28 Nov 2026 · Nairobi, Kenya</p>
            <div>
              <p className="summit-title">Women In Tech<br />Summit Kenya 2026</p>
              <p className="summit-theme">Beyond Systems: Thrive. Build. Govern.</p>
            </div>
            <Countdown target="2026-11-27T09:00:00+03:00" />
          </div>
        </div>
        <div className="body">
          <p className="kicker">Technology partner · Event platform</p>
          <h3>WIT Summit Kenya</h3>
          <p>Tech partner to Tambua Women In Tech for the second edition of their summit. We built the event website: live countdown, speaker line-up, two-day agenda, ticket tiers with RSVP, and sponsor and partner sections.</p>
          <ul>
            <li>Event website and launch</li>
            <li>Agenda, speakers and ticketing flow</li>
            <li>Ongoing tech support to the organisers</li>
          </ul>
          <a className="ghost plausible-event-name=Work+Click plausible-event-project=wit-summit" style={{ padding: "13px 22px" }} href="https://summit.womenintechblog.dev/" target="_blank" rel="noopener">Visit the summit site ↗</a>
        </div>
      </article>

      <div className="wk-grid">
        <article className="wk wk-card rv">
          <div className="art" style={{ background: "#DDE7FF" }}>
            <div className="viz" style={{ alignItems: "flex-end", gap: 14, paddingTop: 28 }}>
              <div className="mock fl" style={{ height: 200 }}>
                <span style={{ height: 8, width: "60%", background: "#1B2440", borderRadius: 4 }} />
                <span style={{ height: 36, background: "#6C7CFF" }} />
                <span /><span /><span />
              </div>
              <div className="mock fl2" style={{ height: 168 }}>
                <span style={{ height: 8, width: "45%", background: "#1B2440", borderRadius: 4 }} />
                <span style={{ display: "flex", gap: 4, background: "none", height: 42 }}>
                  <span style={{ flex: 1, height: 42, background: "#FFB36B" }} />
                  <span style={{ flex: 1, height: 42, background: "#6C7CFF" }} />
                </span>
                <span />
              </div>
            </div>
          </div>
          <div className="body">
            <p className="kicker">Mobile app · Open source</p>
            <h3>Taskez</h3>
            <p>A productivity app built in Flutter for Android, iOS, macOS and web. On Google Play and open-sourced, with 960+ stars and 190 forks on GitHub.</p>
            <a className="link-strong plausible-event-name=Work+Click plausible-event-project=taskez" href="https://github.com/Davies-K/Taskez" target="_blank" rel="noopener">View on GitHub ↗</a>
          </div>
        </article>

        <article className="wk wk-card rv">
          <div className="art" style={{ background: "#1A1D23" }}>
            <div className="viz" style={{ flexDirection: "column", gap: 22 }}>
              <div className="play"><PlayIcon /></div>
              <EqBars count={7} height={34} />
            </div>
          </div>
          <div className="body">
            <p className="kicker">Video · AI-assisted editing</p>
            <h3>[VIDEO TITLE]</h3>
            <p>[One or two lines on the video: who it was for, what we shot or edited, and where AI tools helped.]</p>
            <a className="link-strong plausible-event-name=Work+Click plausible-event-project=video" href="https://www.youtube.com/watch?v=YCfG3QhgF4A" target="_blank" rel="noopener">Watch on YouTube ↗</a>
          </div>
        </article>

        <article className="wk wk-card rv">
          <div className="art" style={{ background: "#0B2A2A" }}>
            <div className="viz" style={{ padding: 24 }}>
              <p style={{ display: "flex", alignItems: "center", fontFamily: "var(--mono)", fontSize: 18, fontWeight: 600, letterSpacing: "0.24em", color: "#7FE3D4" }}>
                <span className="ty">A FLUTTER DEV STORY</span>
                <span className="cur" style={{ display: "inline-block", width: 3, height: 24, background: "#7FE3D4", marginLeft: 4 }} />
              </p>
            </div>
          </div>
          <div className="body">
            <p className="kicker">Web · Flutter Web</p>
            <h3>Interactive portfolio</h3>
            <p>A story-driven portfolio built entirely with Flutter Web: one codebase shipping to browsers as well as phones.</p>
            <a className="link-strong plausible-event-name=Work+Click plausible-event-project=portfolio" href="https://davies-k.github.io/flutter-web-portfolio/#/" target="_blank" rel="noopener">Open the site ↗</a>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ---------------- process ---------------- */
const STEPS = [
  { t: "Discover", d: "A short call about your goals, audience and budget. You get a written scope and a fixed quote." },
  { t: "Design & motion", d: "We show you the look, the layout and how it moves before any code, and refine it with you." },
  { t: "Build & launch", d: "We build, test on real devices, set up hosting, Google and analytics, and go live." },
  { t: "Grow & scale", d: "Social, content and support plans, and scaling when your traffic and users grow." },
];

export function Process() {
  return (
    <section id="process" className="paper process">
      <div className="container section wrap">
        <p className="bigword par" aria-hidden="true">flow</p>
        <div className="grid">
          <div className="intro rv">
            <Eyebrow n="05">Process</Eyebrow>
            <h2 className="h2">How we work</h2>
            <p>Clear steps, a fixed quote up front, and one point of contact from first call to launch.</p>
          </div>
          <div className="steps">
            <div aria-hidden="true" className="vline" />
            <ol>
            {STEPS.map((s, i) => (
              <li key={s.t} className="rv">
                <span aria-hidden="true" className="node" />
                <div>
                  <p className="lbl">step {String(i + 1).padStart(2, "0")}</p>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- packages ---------------- */
const PACKS = [
  { t: "Launch", tag: "Get your business online, properly.", price: "[PRICE]", per: "", items: ["Animated website, up to 5 pages", "Google Business profile & Maps", "Basic SEO and analytics", "Launch social posts"], cta: "Get a quote" },
  { t: "Event Tech", tag: "Everything your event needs online.", price: "[PRICE]", per: "", items: ["Event site with live countdown", "Speakers, agenda & partners", "Ticketing / RSVP integration", "Promo & recap video", "Tech support on event days"], cta: "Plan my event", best: true },
  { t: "Grow", tag: "Ongoing content, marketing and tech.", price: "[PRICE]", per: " / month", items: ["Social media management", "Monthly motion & video content", "Site updates and hosting", "AI assistant and automation support"], cta: "Talk to us" },
];

export function Packages() {
  return (
    <section id="packages" className="container section">
      <div className="section-head rv">
        <div>
          <Eyebrow n="06">Packages</Eyebrow>
          <h2 className="h2">Pick a starting point</h2>
        </div>
        <p>Every project gets a fixed quote. These are the packages most clients start from.</p>
      </div>
      <div className="cards" style={{ alignItems: "stretch" }}>
        {PACKS.map((p) => (
          <article key={p.t} className={"pk rv" + (p.best ? " best" : "")}>
            {p.best ? <span className="badge">Best value</span> : null}
            <h3>{p.t}</h3>
            <p className="tag">{p.tag}</p>
            <p className="price">{p.price}{p.per ? <small>{p.per}</small> : null}</p>
            <ul>{p.items.map((it) => <li key={it}>✓ {it}</li>)}</ul>
            <a
              href={`?package=${encodeURIComponent(p.t)}#contact`}
              className={(p.best ? "btn btn-dark" : "ghost") + ` plausible-event-name=Package+Click plausible-event-package=${p.t.replace(/\s+/g, "+")}`}
            >
              {p.cta}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- footer ---------------- */
export function Footer({ city, github, linkedin }: { city: string; github: string; linkedin: string }) {
  return (
    <footer className="container site-footer">
      <p className="copy">
        <span className="logo-tile"><img src="/logo.png" alt="Genius Inc. logo" /></span>
        © {new Date().getFullYear()} Genius Inc. · {city}, Germany
      </p>
      <nav aria-label="Footer">
        <a href={github} target="_blank" rel="noopener">GitHub</a>
        <a href={linkedin} target="_blank" rel="noopener">LinkedIn</a>
        <a href="/impressum">Impressum</a>
        <a href="/datenschutz">Datenschutz</a>
      </nav>
    </footer>
  );
}
