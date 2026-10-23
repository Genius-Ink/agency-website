"use client";

import { useEffect, useState } from "react";

function parts(target: number, now: number) {
  let diff = Math.max(0, Math.floor((target - now) / 1000));
  const d = Math.floor(diff / 86400); diff -= d * 86400;
  const h = Math.floor(diff / 3600); diff -= h * 3600;
  const m = Math.floor(diff / 60);
  const s = diff - m * 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    { v: String(d), l: "days" },
    { v: pad(h), l: "hours" },
    { v: pad(m), l: "min" },
    { v: pad(s), l: "sec" },
  ];
}

export default function Countdown({ target }: { target: string }) {
  const t = Date.parse(target);
  // Render nothing time-dependent on the server to avoid hydration mismatches.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const items = now === null ? parts(t, t).map((p) => ({ ...p, v: "–" })) : parts(t, now);
  return (
    <div className="countdown" role="timer" aria-label="Countdown to the summit">
      {items.map((p) => (
        <div key={p.l}><b>{p.v}</b><small>{p.l}</small></div>
      ))}
    </div>
  );
}
