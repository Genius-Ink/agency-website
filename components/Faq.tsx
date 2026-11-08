"use client";

import { useState } from "react";

const FAQS = [
  { q: "How long does a website take?", a: "Most small business sites go live in [X–Y] weeks after we agree the scope. Event sites are planned backwards from your event date." },
  { q: "Where do you work?", a: "Across Europe and Africa. We work remotely with clients in any country and can be on-site for events." },
  { q: "Can you add AI to my business?", a: "Yes. From a website chat assistant that answers customers around the clock to automations that save your team hours each week. We start with what will actually help, not with the hype." },
  { q: "Can you take over an existing website or app?", a: "Yes. We start with a short technical review, then tell you plainly whether to improve what you have or rebuild." },
  { q: "Do you handle hosting, domains and Google setup?", a: "Yes. We set up hosting, your domain, Google Business profile, Maps listing and analytics, and hand over all the logins to you." },
  { q: "How do payments work?", a: "[Your payment terms — e.g. a deposit to start and the balance at launch.]" },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="container faq" style={{ paddingBottom: 112 }}>
      <div className="intro rv">
        <p className="eyebrow"><b>06</b>FAQ</p>
        <h2 className="h2">Questions</h2>
      </div>
      <div className="list">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={"item" + (isOpen ? " open" : "")}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                id={`faq-q-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{f.q}</span>
                <span className="plus" aria-hidden="true">+</span>
              </button>
              {isOpen ? (
                <p id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="ans">{f.a}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
