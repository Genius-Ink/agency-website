"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { budgets, services } from "@/lib/site";
import { readAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";

type Errors = Partial<Record<string, string>>;
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [pkg, setPkg] = useState("");
  const startedAt = useRef<number>(0);
  const touched = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
    const p = new URLSearchParams(window.location.search).get("package");
    if (p) setPkg(p.slice(0, 40));
  }, []);

  // Packages links add ?package=… — pick that up when clicked on the same page too.
  useEffect(() => {
    const onHash = () => {
      const p = new URLSearchParams(window.location.search).get("package");
      if (p) setPkg(p.slice(0, 40));
    };
    window.addEventListener("popstate", onHash);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("popstate", onHash);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  function onFirstInput() {
    if (!touched.current) {
      touched.current = true;
      track("Form Start");
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      services: fd.getAll("services").map(String),
      budget: (fd.get("budget") as string) || undefined,
      package: pkg,
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      startedAt: startedAt.current,
      turnstileToken: (fd.get("cf-turnstile-response") as string) || undefined,
      attribution: readAttribution(),
    };

    setStatus("sending");
    setErrors({});
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Errors; error?: string };
      if (res.ok && data.ok) {
        setStatus("sent");
        track("Lead Submitted", { services: payload.services.join(",") || "none", package: pkg || "none" });
        form.reset();
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerError(data.error ?? "Something went wrong. Please try again or email us directly.");
      setStatus("error");
    } catch {
      setServerError("We couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="form" role="status" aria-live="polite">
        <div className="success">
          <span className="tick" aria-hidden="true">✓</span>
          <h3>Thanks, we&apos;ve got it.</h3>
          <p>We&apos;ll reply within one working day. A confirmation is on its way to your inbox.</p>
          <button type="button" className="ghost" onClick={() => setStatus("idle")} style={{ marginTop: 8 }}>
            Send another message
          </button>
        </div>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? <span className="err" id={`${k}-err`}>{errors[k]}</span> : null;

  return (
    <form className="form" onSubmit={onSubmit} onInput={onFirstInput} noValidate aria-describedby={serverError ? "form-err" : undefined}>
      {TURNSTILE_KEY ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer /> : null}

      <div className="row">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input className="input" id="name" name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} placeholder="Ama Mensah" />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input className="input" id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} placeholder="you@business.com" />
          {err("email")}
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="phone">Phone / WhatsApp <span className="opt">(optional)</span></label>
          <input className="input" id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+49 …" />
        </div>
        <div className="field">
          <label htmlFor="company">Business or event <span className="opt">(optional)</span></label>
          <input className="input" id="company" name="company" autoComplete="organization" placeholder="Name of your business" />
        </div>
      </div>

      <fieldset className="fieldset">
        <legend>What do you need? <span className="opt" style={{ color: "var(--dim)", fontWeight: 500 }}>(pick any)</span></legend>
        <div className="pills">
          {services.map((s) => (
            <label key={s} className="pill">
              <input type="checkbox" name="services" value={s} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="row">
        <div className="field">
          <label htmlFor="budget">Budget <span className="opt">(optional)</span></label>
          <select className="input" id="budget" name="budget" defaultValue="">
            <option value="" disabled>Choose a range</option>
            {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="package">Package <span className="opt">(optional)</span></label>
          <select className="input" id="package" name="package" value={pkg} onChange={(e) => setPkg(e.target.value)}>
            <option value="">Not sure yet</option>
            <option value="Launch">Launch</option>
            <option value="Event Tech">Event Tech</option>
            <option value="Grow">Grow</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">Tell us about your project</label>
        <textarea className="input" id="message" name="message" required aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} placeholder="What are you working on, and when do you need it?" />
        {err("message")}
      </div>

      {/* Honeypot: hidden from people, tempting for bots */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="consent">
          <input type="checkbox" name="consent" required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-err" : undefined} />
          <span>
            I agree that Genius Inc. may store my details to reply to this enquiry. See our{" "}
            <a href="/datenschutz">privacy policy</a>.
          </span>
        </label>
        {err("consent")}
      </div>

      {TURNSTILE_KEY ? <div className="cf-turnstile" data-sitekey={TURNSTILE_KEY} data-theme="dark" /> : null}

      {serverError ? <p id="form-err" className="alert bad" role="alert">{serverError}</p> : null}

      <div className="form-foot">
        <small>We reply within one working day.</small>
        <button type="submit" className="btn" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry →"}
        </button>
      </div>
    </form>
  );
}
