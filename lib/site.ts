// Central place for company details. Fill in the placeholders before launch.
export const site = {
  name: "Genius Inc.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", // digits only, e.g. 491701234567
  city: "[CITY]",
  linkedin: "https://www.linkedin.com/company/71351025/",
  github: "https://github.com/Davies-K",
};

export const services = [
  "Website design & build",
  "Event technology",
  "Video, motion & AI",
  "Business online & Google Maps",
  "Social media marketing",
  "Apps & scaling",
  "AI integration & tech decisions",
] as const;

export const budgets = [
  "Not sure yet",
  "Under €1,000",
  "€1,000 – €3,000",
  "€3,000 – €10,000",
  "€10,000+",
] as const;
