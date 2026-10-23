// First-touch attribution: remembers how a visitor first arrived (UTM tags, referrer,
// landing page) for this browser session, so it can be stored with their enquiry.
// Uses sessionStorage only — no cookies, nothing sent anywhere until they submit the form.

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_page?: string;
  first_seen_at?: string;
};

const KEY = "gi_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) data[k] = v.slice(0, 200);
    }
    const ref = document.referrer;
    if (ref && !ref.startsWith(window.location.origin)) data.referrer = ref.slice(0, 500);
    data.landing_page = (window.location.pathname + window.location.search).slice(0, 500);
    data.first_seen_at = new Date().toISOString();
    window.sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage may be blocked — attribution is best-effort */
  }
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
