

export type Testimonial = {
  quote: string;
  name: string;
  role: string; // e.g. "Organising team, WIT Summit Kenya"
  service?: string; // e.g. "Event technology"
  link?: string; // optional: client's site or LinkedIn
};

const TAMBUA = {
  name: "Tambua Women In Tech",
  role: "Organisers, WIT Summit Kenya",
  link: "https://summit.womenintechblog.dev/",
};

export const testimonials: Testimonial[] = [
  {
    ...TAMBUA,
    quote:
      "Genius Inc. gave our second summit a home online. The site has the countdown, speakers, the full two-day agenda and ticketing, and it looks like the event we're building.",
    service: "Event technology",
  },
  {
    ...TAMBUA,
    quote:
      "They didn't hand over a website and disappear. When we add speakers, sponsors or agenda changes, it's done quickly, and we have a tech partner we can call.",
    service: "Ongoing tech support",
  },
];
