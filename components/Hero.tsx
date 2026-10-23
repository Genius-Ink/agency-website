"use client";

import { useEffect, useRef, useState } from "react";
import { EqBars, Spark, SPARK } from "./icons";

const WORDS = ["websites.", "events.", "videos.", "social media.", "AI."];

const NOTES = [
  { at: 1, icon: "M4 6h16v12H4z M4 7l8 6 8-6", color: "#F1BA55", ink: "#0B0D10", title: "New enquiry from your website", sub: "Someone wants a quote", time: "now" },
  { at: 3, icon: "M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z M12 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", color: "#EC3A48", ink: "#FFFFFF", title: "Found on Google Maps", sub: "A customer asked for directions", time: "2m" },
  { at: 5, icon: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4", color: "#2EB3C9", ink: "#0B0D10", title: "New booking confirmed", sub: "Saturday, 10:00", time: "5m" },
  { at: 7, icon: "M8 5v14l11-7z", color: "#A5216A", ink: "#FFFFFF", title: "Your promo video is live", sub: "Shared to Instagram and TikTok", time: "9m" },
  { at: 9, icon: SPARK, color: "#F6F6F2", ink: "#A5216A", title: "Your AI assistant replied", sub: "Answered a pricing question at 23:40", time: "12m" },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const [word, setWord] = useState(0);
  const [step, setStep] = useState(reduced ? 15 : 0);

  useEffect(() => {
    if (reduced) { setStep(15); return; }
    const w = setInterval(() => setWord((i) => (i + 1) % WORDS.length), 1900);
    const s = setInterval(() => setStep((i) => (i + 1) % 16), 650);
    return () => { clearInterval(w); clearInterval(s); };
  }, [reduced]);

  const on = (k: number) => (step >= k ? " on" : "");

  // ---- robot that chases the cursor ----
  const sectionRef = useRef<HTMLElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLSpanElement>(null);
  const idleRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<HTMLDivElement>(null);
  const m = useRef({ bx: 0, by: 0, tx: 0, ty: 0, mx: null as number | null, my: 0, ax: 0 });

  useEffect(() => {
    if (reduced) return;
    const sec = sectionRef.current;
    if (!sec || !window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      const bot = botRef.current;
      if (!bot) return;
      const r = sec.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const hx = bot.offsetLeft, hy = bot.offsetTop;
      const s = m.current;
      s.mx = mx; s.my = my;
      s.tx = Math.max(-hx + 8, Math.min(r.width - hx - 110, mx - hx + 26));
      s.ty = Math.max(-hy + 8, Math.min(r.height - hy - 150, my - hy + 14));
    };
    const onLeave = () => { const s = m.current; s.tx = 0; s.ty = 0; s.mx = null; };
    sec.addEventListener("mousemove", onMove);
    sec.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const loop = () => {
      const s = m.current;
      const px = s.bx, py = s.by;
      s.bx += (s.tx - s.bx) * 0.07;
      s.by += (s.ty - s.by) * 0.07;
      const vx = s.bx - px, vy = s.by - py;
      const speed = Math.hypot(vx, vy);
      s.ax += (Math.max(-28, Math.min(28, vx * 2.4)) - s.ax) * 0.2;
      const bot = botRef.current, tilt = tiltRef.current, eyes = eyesRef.current;
      if (bot) bot.style.transform = `translate3d(${s.bx.toFixed(1)}px, ${s.by.toFixed(1)}px, 0)`;
      if (tilt) {
        tilt.style.transform = `rotate(${s.ax.toFixed(2)}deg)`;
        tilt.style.setProperty("--thrust", (1 + Math.min(speed / 5, 1.8)).toFixed(2));
      }
      if (eyes && bot) {
        let ex = 0, ey = 0, happy = false;
        if (s.mx !== null) {
          const dx = s.mx - (bot.offsetLeft + s.bx + 48);
          const dy = s.my - (bot.offsetTop + s.by + 46);
          ex = Math.max(-7, Math.min(7, dx / 18));
          ey = Math.max(-5, Math.min(5, dy / 18));
          happy = Math.hypot(dx, dy) < 90 && speed < 1;
        }
        eyes.style.transform = `translate(${ex.toFixed(1)}px, ${ey.toFixed(1)}px)`;
        eyes.dataset.mood = happy ? "happy" : "calm";
      }
      const moving = speed > 1.2;
      if (idleRef.current) idleRef.current.style.opacity = moving || s.mx !== null ? "0" : "1";
      if (moveRef.current) {
        moveRef.current.style.opacity = moving ? "1" : "0";
        moveRef.current.style.transform = moving ? "scale(1)" : "scale(.9)";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      sec.removeEventListener("mousemove", onMove);
      sec.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <section id="top" ref={sectionRef} className="hero container">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="status in d1"><i className="pulse" />Now taking new projects</p>
          <h1 className="in d2" aria-label="We make your business impossible to ignore, and ready for every customer.">
            <span aria-hidden="true" className="hl">We make your business</span>
            <span aria-hidden="true" className="hl accent" style={{ animationDelay: ".1s" }}>impossible to ignore,</span>
            <span aria-hidden="true" className="hl" style={{ animationDelay: ".2s" }}>and ready for every customer.</span>
          </h1>
          <p className="with-line in d4" aria-label="With websites, events, videos, social media and AI.">
            <span aria-hidden="true" className="dash" />
            <span aria-hidden="true">
              with <span key={word} className="hw">{WORDS[word]}</span>
            </span>
          </p>
          <p className="hero-sub in d5">
            A tech-first studio for businesses and events across Europe and Africa: sites that move, event
            platforms, video, Google presence, social media, apps built to scale, and AI that works for your
            business.
          </p>
          <div className="hero-ctas in d5">
            <a href="#contact" className="btn plausible-event-name=CTA+Click plausible-event-position=hero">Tell us what you need →</a>
            <a href="#work" className="ghost">See the work</a>
          </div>
        </div>

        <div
          className="stage in d3"
          role="img"
          aria-label="Animation: a website and phone app assemble while notifications arrive — a new enquiry, a Google Maps visit, a booking, a promo video and an AI assistant replying to a customer"
        >
          <div className="stage-in">
            <div aria-hidden="true" className="glow" />
            <div aria-hidden="true" className="ring r1" style={{ width: 420, height: 420, right: -110, top: -70, border: "1px dashed #2E333C" }}>
              <span className="dot" style={{ width: 12, height: 12, background: "var(--accent)", top: -6, left: "calc(50% - 6px)" }} />
            </div>
            <div aria-hidden="true" className="ring r2" style={{ width: 260, height: 260, left: -70, bottom: -50, border: "1px solid #22262D" }}>
              <span className="dot" style={{ width: 10, height: 10, background: "#B9A6FF", top: -5, left: "calc(50% - 5px)" }} />
            </div>

            <div className="browser" aria-hidden="true">
              <div className="browser-bar">
                <span className="dots"><i /><i /><i /></span>
                <span className="url"><i>●</i>your-brand.com</span>
              </div>
              <div className="browser-body">
                <div className={"bnav pv" + on(2)}>
                  <span className="left">
                    <img src="/logo.png" alt="" />
                    <span className="bar-s" style={{ width: 52, height: 9, background: "#15171C" }} />
                  </span>
                  <span style={{ display: "flex", gap: 6 }}>
                    <span className="bar-s" style={{ width: 28, height: 6, background: "#C9CBC2", borderRadius: 3 }} />
                    <span className="bar-s" style={{ width: 28, height: 6, background: "#C9CBC2", borderRadius: 3 }} />
                    <span className="bar-s" style={{ width: 40, height: 14, background: "var(--accent)", borderRadius: 7 }} />
                  </span>
                </div>
                <div className={"bhero pv" + on(3)}>
                  <span className="bar-s" style={{ width: "72%", height: 12, background: "#fff", borderRadius: 4 }} />
                  <span className="bar-s" style={{ width: "48%", height: 12, background: "var(--accent)", borderRadius: 4 }} />
                  <span className="bar-s" style={{ width: "60%", height: 6, background: "#5A606B", borderRadius: 3, marginTop: 4 }} />
                </div>
                <div className="bcards">
                  <div className={"pv" + on(4)} style={{ background: "#fff", border: "1px solid #E4E4DD" }} />
                  <div className={"pv" + on(5)} style={{ background: "#DDE7FF" }}>
                    <span className="pin" style={{ left: "calc(50% - 7px)", top: "calc(50% - 12px)" }} />
                  </div>
                  <div className={"pv" + on(6)} style={{ background: "#2A1640", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ width: 0, height: 0, borderLeft: "12px solid #fff", borderTop: "8px solid transparent", borderBottom: "8px solid transparent" }} />
                  </div>
                </div>
                <span className={"live-badge pv" + on(10)}>LIVE</span>
                <span className={"chatb pv" + on(11)}>
                  <span className="msg">Hi! Want to book for Saturday?</span>
                  <span className="av pulse"><Spark /></span>
                </span>
              </div>
            </div>

            <div className="feed" aria-hidden="true">
              <div className="feed-head">
                <span className="feed-title"><img src="/logo.png" alt="" />Your business today</span>
                <span className="feed-live"><i />Live</span>
              </div>
              <div className="feed-list">
                {NOTES.map((n) => (
                  <div key={n.title} className={"note ln" + on(n.at)}>
                    <span className="ic" style={{ background: n.color }}>
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={n.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={n.icon} />
                      </svg>
                    </span>
                    <span className="tx"><b>{n.title}</b><small>{n.sub}</small></span>
                    <time>{n.time}</time>
                  </div>
                ))}
              </div>
            </div>

            <div className="phone fl2" aria-hidden="true">
              <span className="notch" />
              <div className={"pv" + on(2)} style={{ height: 8, width: "50%", borderRadius: 4, background: "#fff" }} />
              <div className={"pv" + on(3)} style={{ height: 52, borderRadius: 8, background: "var(--accent)" }} />
              <div className={"pv" + on(4)} style={{ height: 26, borderRadius: 6, background: "#22262D" }} />
              <div className={"pv" + on(5)} style={{ height: 26, borderRadius: 6, background: "#22262D" }} />
              <div className={"pv" + on(6)} style={{ height: 26, borderRadius: 6, background: "#2A1640" }} />
            </div>

            <div className="chip fl" aria-hidden="true" style={{ top: 250, right: "34%" }}><EqBars />Video ready</div>
            <div className="chip fl2" aria-hidden="true" style={{ top: -14, left: "8%" }}>
              <span className="pin" style={{ position: "static", width: 10, height: 10 }} />On Google Maps
            </div>
          </div>
        </div>
      </div>

      <div ref={botRef} className="botwrap" aria-hidden="true">
        <div className="bfloat">
          <div ref={tiltRef} className="btilt">
            <span style={{ left: 14, top: 118, width: 68, height: 20, borderRadius: "50%", background: "var(--accent)", opacity: 0.28, filter: "blur(14px)" }} />
            <span style={{ left: 47, top: 2, width: 2, height: 16, background: "#5A606B" }} />
            <span className="pulse" style={{ left: 42, top: -6, width: 12, height: 12, borderRadius: "50%", background: "var(--accent)" }} />
            <span style={{ left: 8, top: 16, width: 80, height: 62, borderRadius: 26, background: "#1B1F26", border: "1px solid #3A3F49", boxShadow: "inset 0 2px 0 rgba(255,255,255,.07), 0 22px 40px -14px rgba(0,0,0,.85)" }}>
              <span style={{ position: "absolute", left: -5, top: 22, width: 6, height: 18, borderRadius: 3, background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }} />
              <span style={{ position: "absolute", right: -5, top: 22, width: 6, height: 18, borderRadius: 3, background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }} />
              <span style={{ position: "absolute", left: 9, right: 9, top: 14, height: 32, borderRadius: 16, background: "#07090C", border: "1px solid rgba(241,186,85,.4)", boxShadow: "inset 0 0 16px rgba(241,186,85,.22)", overflow: "hidden" }}>
                <span ref={eyesRef} className="eyes"><span className="eye" /><span className="eye" /></span>
              </span>
            </span>
            <span style={{ left: 24, top: 82, width: 48, height: 32, borderRadius: 15, background: "#1B1F26", border: "1px solid #3A3F49", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="core2" style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--teal)" }} />
            </span>
            <span className="hand1" style={{ left: 6, top: 86, width: 14, height: 14, borderRadius: "50%", background: "#2A2F38", border: "1px solid #3A3F49" }} />
            <span className="hand2" style={{ right: 6, top: 86, width: 14, height: 14, borderRadius: "50%", background: "#2A2F38", border: "1px solid #3A3F49" }} />
            <span className="thr" style={{ left: 33, top: 114, width: 10, height: 18 }}><i /></span>
            <span className="thr" style={{ left: 53, top: 114, width: 10, height: 18 }}><i style={{ animationDelay: "-.09s" }} /></span>
          </div>
        </div>
        <div ref={idleRef} className="bub bub-idle">Hi! I&apos;m your AI assistant.<small>Always on for your customers.</small></div>
        <div ref={moveRef} className="bub bub-move">Right behind you!</div>
      </div>
    </section>
  );
}
