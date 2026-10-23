"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#top", id: "top", label: "Home" },
  { href: "#services", id: "services", label: "Services" },
  { href: "#work", id: "work", label: "Work" },
  { href: "#process", id: "process", label: "Process" },
  { href: "#packages", id: "packages", label: "Packages" },
  { href: "#faq", id: "faq", label: "FAQ" },
];

export default function Header() {
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Highlight the section currently in view
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean,
    ) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Mobile menu: close on Escape, close when resizing up to desktop, lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 901px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {open ? (
        <div className="nav-backdrop" onClick={close} aria-hidden="true" />
      ) : null}
      <header
        className={
          "float-nav in" + (scrolled ? " scrolled" : "") + (open ? " open" : "")
        }
      >
        <div className="float-nav-card">
          <div className="float-nav-row">
            <a href="#top" className="brand" onClick={close}>
              <span className="logo-tile">
                <Image src="/logo.png" alt="" width={53} height={72} priority />
              </span>
              <span className="brand-name">Genius Inc.</span>
            </a>

            <nav className="float-links" aria-label="Main">
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={l.href}
                  className={active === l.id ? "active" : undefined}
                  aria-current={active === l.id ? "true" : undefined}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="nav-right">
              <a
                href="#contact"
                className="nav-cta plausible-event-name=CTA+Click plausible-event-position=header"
                onClick={close}
              >
                <span className="cta-long">Start a project</span>
                <span className="cta-short">Let&apos;s talk</span>
                <span aria-hidden="true">→</span>
              </a>
              <button
                type="button"
                className={"burger" + (open ? " open" : "")}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((o) => !o)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>

          {open ? (
            <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <a
                  key={l.id}
                  href={l.href}
                  className={active === l.id ? "active" : undefined}
                  style={{ animationDelay: `${0.04 * i}s` }}
                  onClick={close}
                >
                  <span className="mm-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                  <span className="mm-arr" aria-hidden="true">
                    →
                  </span>
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </header>
    </>
  );
}
