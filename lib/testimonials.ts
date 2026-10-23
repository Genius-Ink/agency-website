// Real client quotes only. Ask the client for permission to publish their words, name and role.
// Entries with `placeholder: true` are shown (labelled "Sample") in development so you can see the
// layout, and are NEVER rendered in production. The section hides itself until at least one real
// testimonial exists.

export type Testimonial = {
  quote: string;
  name: string;
  role: string; // e.g. "Founder, Tambua Women In Tech"
  service?: string; // e.g. "Event technology"
  link?: string; // optional: client's site or LinkedIn
  placeholder?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    placeholder: true,
    quote: "[Paste the client's own words here — one to three sentences about the result they got.]",
    name: "[Client name]",
    role: "[Role, organisation]",
    service: "Event technology",
  },
  {
    placeholder: true,
    quote: "[What changed for their business after working with Genius Inc.?]",
    name: "[Client name]",
    role: "[Role, organisation]",
    service: "Website design & build",
  },
  {
    placeholder: true,
    quote: "[A short quote about the video, social media or AI work.]",
    name: "[Client name]",
    role: "[Role, organisation]",
    service: "Video, motion & AI",
  },
];
