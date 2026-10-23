import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Datenschutz", robots: { index: false } };

// TEMPLATE — a starting outline that lists the tools this site actually uses.
// Generate the full legal text (e.g. eRecht24) or have it reviewed before launch.
export default function Datenschutz() {
  return (
    <main className="legal">
      <Link href="/">← Back to home</Link>
      <h1 style={{ marginTop: 24 }}>Datenschutzerklärung</h1>

      <h2>1. Verantwortlicher</h2>
      <p>[Name, address, email — same as the Impressum]</p>

      <h2>2. Hosting</h2>
      <p>This website is hosted by [Vercel Inc. / your host]. When you visit, the host processes technical data such as your IP address and browser type to deliver the site securely (Art. 6(1)(f) GDPR).</p>

      <h2>3. Kontaktformular</h2>
      <p>When you send an enquiry we store the details you enter (name, email, optional phone and business, selected services, budget, message) together with how you found us (campaign tags, referring website, first page visited) so we can reply and understand which channels work. Legal basis: your request and consent (Art. 6(1)(a) and (b) GDPR). Data is stored with [Supabase, region: EU] and emails are sent via [Resend]. We delete enquiries that don&apos;t lead to a project after [12 months].</p>

      <h2>4. Analyse</h2>
      <p>We use [Plausible Analytics], a privacy-friendly tool that does not use cookies and does not store personal data or IP addresses. It tells us which pages are visited and which buttons are clicked, in aggregate.</p>

      <h2>5. Spam-Schutz</h2>
      <p>[If enabled:] The contact form uses Cloudflare Turnstile to block automated spam. Cloudflare processes technical data from your browser for this purpose (Art. 6(1)(f) GDPR).</p>

      <h2>6. Schriftarten</h2>
      <p>All fonts are hosted on our own server. No connection to Google Fonts is made.</p>

      <h2>7. Ihre Rechte</h2>
      <p>You can request access to, correction or deletion of your data, restrict or object to processing, and withdraw consent at any time by emailing [email]. You also have the right to complain to a data protection authority.</p>
    </main>
  );
}
