import ContactForm from "./ContactForm";
import { site } from "@/lib/site";

export default function Contact() {
  const words = Array.from({ length: 8 }, (_, i) => i);
  return (
    <section id="contact" className="contact">
      <div className="big strip" aria-hidden="true" style={{ border: 0, padding: 0, margin: "0 0 56px" }}>
        <div className="mq">
          {words.map((i) => (
            <span key={i} className={i % 4 === 1 || i % 4 === 3 ? "out" : i % 4 === 2 ? "acc" : "solid"}>Let&apos;s build</span>
          ))}
        </div>
      </div>
      <div className="container contact-grid">
        <div className="contact-intro rv">
          <p className="eyebrow"><b>07</b>Contact</p>
          <h2>Have a business, an event or an idea?</h2>
          <p>Tell us what you&apos;re working on. We&apos;ll reply within one working day with next steps.</p>
          <div className="contact-alt">
            <a className="ghost plausible-event-name=Contact+Click plausible-event-channel=email" href={`mailto:${site.email}`}>Email {site.email}</a>
            {site.whatsapp ? (
              <a className="ghost plausible-event-name=Contact+Click plausible-event-channel=whatsapp" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">WhatsApp us</a>
            ) : null}
            <a className="ghost plausible-event-name=Contact+Click plausible-event-channel=linkedin" href={site.linkedin} target="_blank" rel="noopener">Follow us on LinkedIn</a>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
