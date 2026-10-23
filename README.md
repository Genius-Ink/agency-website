# Genius Inc. — website

Next.js 16 (App Router, TypeScript) site for Genius Inc.: animated hero with the cursor-chasing AI bot, services, work, process, packages, FAQ and a contact form that stores leads with their source.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional in dev
npm run dev                  # http://localhost:3000
```

`npm run build && npm start` runs the production build locally.

## Go live (≈30 minutes)

1. **GitHub** – push this folder to a new repo.
2. **Supabase** – create a project in an **EU region** (e.g. Frankfurt). Open *SQL Editor*, paste `supabase/migrations/001_leads.sql`, run it. Copy the project URL and the `service_role` key.
3. **Resend** – create an API key, verify your domain, set `MAIL_FROM` to an address on it.
4. **Plausible** (optional) – add your domain at plausible.io, set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
5. **Vercel** – import the repo, add the variables from `.env.example`, deploy, then connect your domain.
6. **Before launch** – fill in `[placeholders]`: prices and FAQ answers (`components/Sections.tsx`, `components/Faq.tsx`), city (`lib/site.ts`), the video card, and the legal pages in `app/impressum` and `app/datenschutz` (generate the final text with eRecht24 or have it checked).

## How leads and tracking work

| What | Where | Notes |
|---|---|---|
| Enquiries | Supabase `leads` table | Every submission, with status `new → contacted → proposal → won/lost`, `notes`, `value_eur` you can edit in the Supabase table view. |
| Where each lead came from | same row | `utm_*`, `referrer`, `landing_page`, `first_seen_at` — captured on the visitor's first page view in sessionStorage (no cookies) and sent only with the form. |
| Which channels work | `lead_sources` view | Leads and wins per source (linkedin, google.com, direct…). |
| Visits, clicks, funnel | Plausible | Cookieless. Custom events: `CTA Click` (position), `Work Click` (project), `Package Click` (package), `Contact Click` (channel), `Form Start`, `Lead Submitted`. Add them as Goals in Plausible. |
| Alerts | Email via Resend | You get every lead instantly (reply-to set to the customer); the customer gets a confirmation. |

**Campaign links:** tag links you share so leads show their source, e.g.
`https://your-domain.com/?utm_source=linkedin&utm_medium=social&utm_campaign=launch`
Use `utm_source=google-business` on your Google Maps profile website link.

**Package buttons** link to `?package=Launch#contact`, which pre-selects that package in the form.

## Spam & safety

- Honeypot field + "submitted too fast" check (bots get a fake success, nothing stored).
- Optional Cloudflare Turnstile (set both Turnstile keys).
- Simple per-IP rate limit (5 per 10 min per server instance).
- The `leads` table has Row Level Security on with **no public policies** — only the server with the service-role key can read/write.
- In production, if neither Supabase nor email is configured the form returns an error rather than silently losing leads.

## Where things live

```
app/page.tsx              page composition + JSON-LD for Google
app/api/contact/route.ts  lead API: validate → anti-spam → Supabase → emails
components/Hero.tsx       headline rotation, build-loop scene, chasing robot
components/Sections.tsx   marquee, services, audience, work, process, packages, footer
components/ContactForm.tsx form UI, attribution, analytics events
lib/site.ts               company details, services and budget options
lib/attribution.ts        first-touch UTM/referrer capture
supabase/migrations/      leads table, status enum, lead_sources view
```

Fonts are self-hosted via Fontsource (no Google Fonts requests — important for GDPR in Germany).
