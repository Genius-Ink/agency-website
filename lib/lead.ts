import { z } from "zod";
import { budgets, services } from "./site";

// Shared between the form (client) and the API route (server).
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  services: z.array(z.enum(services)).max(services.length).default([]),
  budget: z.enum(budgets).optional(),
  package: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(10, "A sentence or two helps us reply properly").max(4000),
  consent: z.literal(true, { message: "Please agree so we can reply to you" }),
  // anti-spam
  website: z.string().max(0).optional().or(z.literal("")), // honeypot: must stay empty
  startedAt: z.number().optional(), // ms timestamp when the form was rendered
  turnstileToken: z.string().max(4096).optional(),
  // attribution (first touch)
  attribution: z
    .object({
      utm_source: z.string().max(200).optional(),
      utm_medium: z.string().max(200).optional(),
      utm_campaign: z.string().max(200).optional(),
      utm_term: z.string().max(200).optional(),
      utm_content: z.string().max(200).optional(),
      referrer: z.string().max(500).optional(),
      landing_page: z.string().max(500).optional(),
      first_seen_at: z.string().max(40).optional(),
    })
    .partial()
    .default({}),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
