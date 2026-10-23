import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

// TEMPLATE — replace every [placeholder] with your real details before going live.
// Have it checked (e.g. with an eRecht24 generator or a lawyer).
export default function Impressum() {
  return (
    <main className="legal">
      <Link href="/">← Back to home</Link>
      <h1 style={{ marginTop: 24 }}>Impressum</h1>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>[Full name / company name]<br />[Street and number]<br />[Postcode City]<br />Germany</p>
      <h2>Kontakt</h2>
      <p>E-Mail: [email]<br />Telefon: [phone]</p>
      <h2>Umsatzsteuer-ID</h2>
      <p>[USt-IdNr. if you have one, otherwise remove this section]</p>
      <h2>Verantwortlich für den Inhalt</h2>
      <p>[Name, address]</p>
    </main>
  );
}
