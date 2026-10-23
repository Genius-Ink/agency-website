import { NextResponse } from "next/server";
import { leadSchema, type Lead } from "@/lib/lead";

export const runtime = "nodejs";

const env = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  resendKey: process.env.RESEND_API_KEY,
  notifyTo: process.env.LEAD_NOTIFY_EMAIL,
  mailFrom: process.env.MAIL_FROM ?? "Genius Inc. <onboarding@resend.dev>",
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY,
};

// Very small in-memory rate limit (per server instance). Good enough to stop casual abuse;
// use Upstash/Vercel KV for a shared limit if you get real traffic.
const hits = new Map<string, number[]>();
function rateLimited(ip: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > limit;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function verifyTurnstile(token: string | undefined, ip: string) {
  if (!env.turnstileSecret) return true; // not configured — skip
  if (!token) return false;
  const body = new URLSearchParams({ secret: env.turnstileSecret, response: token, remoteip: ip });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return !!data.success;
}

async function saveLead(lead: Lead, meta: { ip: string; userAgent: string }) {
  if (!env.supabaseUrl || !env.supabaseKey) {
    console.warn("[contact] Supabase not configured — lead not stored:", lead.email);
    return { stored: false };
  }
  const a = lead.attribution ?? {};
  const row = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone || null,
    company: lead.company || null,
    services: lead.services,
    budget: lead.budget ?? null,
    package: lead.package || null,
    message: lead.message,
    consent_at: new Date().toISOString(),
    utm_source: a.utm_source ?? null,
    utm_medium: a.utm_medium ?? null,
    utm_campaign: a.utm_campaign ?? null,
    utm_term: a.utm_term ?? null,
    utm_content: a.utm_content ?? null,
    referrer: a.referrer ?? null,
    landing_page: a.landing_page ?? null,
    first_seen_at: a.first_seen_at ?? null,
    user_agent: meta.userAgent.slice(0, 300),
  };
  const res = await fetch(`${env.supabaseUrl}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: env.supabaseKey,
      Authorization: `Bearer ${env.supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
  return { stored: true };
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  if (!env.resendKey) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.mailFrom, to: [to], subject, html, reply_to: replyTo }),
  });
  if (!res.ok) console.error("[contact] Resend error", res.status, await res.text());
  return res.ok;
}

function sourceLabel(lead: Lead) {
  const a = lead.attribution ?? {};
  if (a.utm_source) return [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ");
  if (a.referrer) {
    try { return new URL(a.referrer).hostname; } catch { return a.referrer; }
  }
  return "Direct / unknown";
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const userAgent = req.headers.get("user-agent") ?? "";

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many messages from your connection. Please try again later." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key === "website") return NextResponse.json({ ok: true }); // honeypot hit: pretend success
      if (!errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, errors, error: "Please check the highlighted fields." }, { status: 422 });
  }
  const lead = parsed.data;

  // Bots usually submit within a second or two of loading the page.
  if (lead.startedAt && Date.now() - lead.startedAt < 2500) return NextResponse.json({ ok: true });

  if (!(await verifyTurnstile(lead.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "Spam check failed. Please refresh the page and try again." }, { status: 400 });
  }

  try {
    const { stored } = await saveLead(lead, { ip, userAgent });
    if (!stored && !(env.resendKey && env.notifyTo) && process.env.NODE_ENV === "production") {
      // Nowhere to put the lead — fail loudly instead of silently losing it.
      console.error("[contact] No storage or notification configured in production.");
      return NextResponse.json({ ok: false, error: "Our form is being set up. Please email us directly for now." }, { status: 503 });
    }
  } catch (e) {
    console.error("[contact]", e);
    return NextResponse.json({ ok: false, error: "We couldn't save your message. Please email us directly." }, { status: 500 });
  }

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || "—"],
    ["Business / event", lead.company || "—"],
    ["Services", lead.services.join(", ") || "—"],
    ["Budget", lead.budget ?? "—"],
    ["Package", lead.package || "—"],
    ["Source", sourceLabel(lead)],
    ["Landing page", lead.attribution?.landing_page ?? "—"],
  ];
  const table = rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`).join("");

  await Promise.allSettled([
    env.notifyTo
      ? sendEmail(
          env.notifyTo,
          `New enquiry: ${lead.name}${lead.services[0] ? " · " + lead.services[0] : ""}`,
          `<h2>New website enquiry</h2><table>${table}</table><p style="white-space:pre-wrap">${esc(lead.message)}</p>`,
          lead.email,
        )
      : Promise.resolve(false),
    sendEmail(
      lead.email,
      "Thanks — we've got your message",
      `<p>Hi ${esc(lead.name.split(" ")[0])},</p><p>Thanks for reaching out to Genius Inc. We've received your message and will reply within one working day.</p><p>— The Genius Inc. team</p>`,
      env.notifyTo,
    ),
  ]);

  return NextResponse.json({ ok: true });
}
