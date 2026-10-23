import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { site } from "@/lib/site";
import Attribution from "@/components/Attribution";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Genius Inc. — Websites, events, video, social media & AI",
    template: "%s · Genius Inc.",
  },
  description:
    "Genius Inc. makes businesses impossible to ignore: websites, event platforms, video, Google presence, social media, app scaling and AI integration across Europe and Africa.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "Genius Inc.",
    title: "Genius Inc. — Make your business impossible to ignore",
    description:
      "Websites, event tech, video, Google presence, social media and AI for businesses and events across Europe and Africa.",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d10",
  width: "device-width",
  initialScale: 1,
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.tagged-events.js";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {plausibleDomain ? (
          <>
            <Script defer data-domain={plausibleDomain} src={plausibleSrc} strategy="afterInteractive" />
            <Script id="plausible-queue" strategy="afterInteractive">
              {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
            </Script>
          </>
        ) : null}
        <Attribution />
        {children}
      </body>
    </html>
  );
}
