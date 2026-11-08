import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Audience, Footer, Marquee, Process, Services, Work } from "@/components/Sections";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Testimonials from "@/components/Testimonials";
import CodeDrawer from "@/components/CodeDrawer";
import { site } from "@/lib/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo-badge.png`,
    email: site.email,
    areaServed: ["Europe", "Africa"],
    sameAs: [site.linkedin, site.github],
    description:
      "Websites, event technology, video, Google presence, social media marketing, app scaling and AI integration.",
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Audience />
        <Work />
        <Testimonials />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer city={site.city} github={site.github} linkedin={site.linkedin} />
      <CodeDrawer />
    </>
  );
}
