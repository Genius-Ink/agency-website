"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fileUrl, KIND_LABEL, projects, type Project, type ProjectKind } from "@/lib/projects";
import { highlightLine } from "@/lib/highlight";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";
import { CodeIcon } from "./icons";

// Any <ShowCodeButton> opens the single <CodeDrawer> mounted on the page. `#code` or
// `#code/<project-id>` in the URL opens it too, so a project can be shared as a link.
const OPEN_EVENT = "smc:open";
const KINDS: ProjectKind[] = ["web", "mobile", "package", "backend"];
const LANG_LABEL = { dart: "Dart", ts: "TypeScript", js: "JavaScript", yaml: "YAML" } as const;

const ORDERED = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];

export function ShowCodeButton({ position, className = "ghost", children = "Show me the code" }: { position: string; className?: string; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className + " smc-trigger"}
      onClick={() => {
        track("Code Open", { position });
        window.dispatchEvent(new CustomEvent(OPEN_EVENT));
      }}
    >
      <CodeIcon />
      {children}
    </button>
  );
}

function parseHash(): string | null | undefined {
  const m = /^#code(?:\/([\w-]+))?$/.exec(window.location.hash);
  if (!m) return undefined;
  return m[1] ?? null;
}

export default function CodeDrawer() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | ProjectKind>("all");
  const [selected, setSelected] = useState<Project>(ORDERED[0]);
  const [mobileDetail, setMobileDetail] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const show = useCallback((id?: string | null) => {
    opener.current = document.activeElement as HTMLElement | null;
    const p = id ? projects.find((x) => x.id === id) : undefined;
    if (p) {
      setSelected(p);
      setMobileDetail(true);
    }
    setMounted(true);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (/^#code/.test(window.location.hash)) history.replaceState(null, "", window.location.pathname + window.location.search);
    opener.current?.focus?.();
  }, []);

  useEffect(() => {
    const onOpen = () => show();
    const onHash = () => {
      const id = parseHash();
      if (id !== undefined) show(id);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener("hashchange", onHash);
    };
  }, [show]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panelRef.current) return;
      const els = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex='-1'])");
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const counts = useMemo(() => {
    const c = new Map<ProjectKind, number>();
    for (const p of projects) c.set(p.kind, (c.get(p.kind) ?? 0) + 1);
    return c;
  }, []);
  const list = filter === "all" ? ORDERED : ORDERED.filter((p) => p.kind === filter);

  const pick = (p: Project) => {
    setSelected(p);
    setMobileDetail(true);
    track("Code Project", { project: p.id });
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const i = list.findIndex((p) => p.id === selected.id);
    const next = list[(i + (e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length];
    setSelected(next);
    panelRef.current?.querySelector<HTMLElement>(`[data-pid="${next.id}"]`)?.focus();
  };

  const chooseFilter = (f: "all" | ProjectKind) => {
    setFilter(f);
    const first = f === "all" ? ORDERED[0] : ORDERED.find((p) => p.kind === f);
    if (first && !(f === "all" || selected.kind === f)) setSelected(first);
  };

  if (!mounted) return null;

  return (
    <div className="smc" data-open={open || undefined} inert={!open}>
      <div className="smc-backdrop" onClick={close} aria-hidden="true" />
      <aside ref={panelRef} className="smc-panel" role="dialog" aria-modal="true" aria-labelledby="smc-title">
        <header className="smc-head">
          <div>
            <p className="smc-tag">// projects</p>
            <h2 id="smc-title">Show me the <span>code</span></h2>
            <p className="smc-meta">{projects.length} projects · live sites and source</p>
          </div>
          <div className="smc-head-actions">
            <a className="smc-gh" href={site.github} target="_blank" rel="noopener">
              <GitHubMark /> <span>All repos</span> <span aria-hidden="true">↗</span>
            </a>
            <button ref={closeRef} type="button" className="smc-x" onClick={close} aria-label="Close projects">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </header>

        <div className={"smc-body" + (mobileDetail ? " show-detail" : "")}>
          <nav className="smc-side" aria-label="Projects">
            {counts.size > 1 ? (
              <div className="smc-chips" role="group" aria-label="Filter projects">
                <Chip on={filter === "all"} onClick={() => chooseFilter("all")} label="All" n={projects.length} />
                {KINDS.filter((k) => counts.has(k)).map((k) => (
                  <Chip key={k} on={filter === k} onClick={() => chooseFilter(k)} label={KIND_LABEL[k]} n={counts.get(k) ?? 0} />
                ))}
              </div>
            ) : null}
            <ul className="smc-list" onKeyDown={onListKey}>
              {list.map((p, i) => (
                <li key={p.id} style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}>
                  <button
                    type="button"
                    data-pid={p.id}
                    className={"smc-item" + (p.id === selected.id ? " on" : "")}
                    aria-current={p.id === selected.id || undefined}
                    onClick={() => pick(p)}
                  >
                    <span className="smc-item-top">
                      <span className="smc-kind">{KIND_LABEL[p.kind]}</span>
                      <span className="smc-year">{p.year}</span>
                    </span>
                    <span className="smc-item-title">{p.title}</span>
                    <span className="smc-item-stack">
                      {p.stack.slice(0, 3).join(" · ")}
                      {p.stars ? <span className="smc-stars">★ {p.stars}</span> : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <Detail key={selected.id} p={selected} onBack={() => setMobileDetail(false)} />
        </div>
      </aside>
    </div>
  );
}

function Chip({ on, onClick, label, n }: { on: boolean; onClick: () => void; label: string; n: number }) {
  return (
    <button type="button" className={"smc-chip" + (on ? " on" : "")} aria-pressed={on} onClick={onClick}>
      {label} <span>{n}</span>
    </button>
  );
}

function Detail({ p, onBack }: { p: Project; onBack: () => void }) {
  const [tab, setTab] = useState<"code" | "preview">(p.file ? "code" : "preview");
  const hasPreview = Boolean(p.preview && p.live);
  const src = fileUrl(p);

  return (
    <section className="smc-detail" aria-label={p.title}>
      <button type="button" className="smc-back" onClick={onBack}>← All projects</button>

      <div className="smc-title-row">
        <div>
          <p className="kicker">{KIND_LABEL[p.kind]} · {p.year}</p>
          <h3>{p.title}</h3>
        </div>
        {p.stars ? (
          <p className="smc-stat">
            <b>★ {p.stars.toLocaleString("en")}</b> stars{p.forks ? <> · <b>{p.forks}</b> forks</> : null}
          </p>
        ) : null}
      </div>
      <p className="smc-summary">{p.summary}</p>
      <ul className="smc-stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>

      {p.file && hasPreview ? (
        <div className="smc-tabs" role="tablist" aria-label="View">
          <button type="button" role="tab" aria-selected={tab === "code"} onClick={() => setTab("code")}>Code</button>
          <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}>Live preview</button>
        </div>
      ) : null}

      {tab === "code" && p.file ? <Editor p={p} href={src} /> : null}
      {tab === "preview" && hasPreview ? <Browser url={p.live!} title={p.title} /> : null}

      {p.install ? <Install cmd={p.install} /> : null}

      <ul className="smc-hl">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>

      <div className="smc-links">
        {p.repo ? <a className="btn btn-sm" href={p.repo} target="_blank" rel="noopener" onClick={() => track("Work Click", { project: p.id })}><GitHubMark /> View repository</a> : null}
        {p.live ? <a className={(p.repo ? "ghost" : "btn") + " btn-sm"} href={p.live} target="_blank" rel="noopener" onClick={() => track("Work Click", { project: p.id })}>Open live site ↗</a> : null}
        {p.pub ? <a className="ghost btn-sm" href={p.pub} target="_blank" rel="noopener">pub.dev ↗</a> : null}
      </div>
    </section>
  );
}

function Editor({ p, href }: { p: Project; href?: string }) {
  const file = p.file!;
  const name = file.path.split("/").pop();
  const dir = file.path.slice(0, file.path.length - (name?.length ?? 0));
  let row = 0;
  return (
    <div className="smc-editor">
      <div className="smc-bar">
        <span className="smc-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="smc-file" title={file.path}><span className="smc-dir">{dir}</span>{name}</span>
        {href ? <a href={href} target="_blank" rel="noopener" className="smc-open">GitHub ↗</a> : null}
      </div>
      <pre className="smc-code" tabIndex={0} aria-label={`${file.path}, excerpt`}>
        <code>
          {file.snippets.map((s, si) => {
            const lines = s.code.split("\n");
            const prev = file.snippets[si - 1];
            const gap = prev ? s.start - (prev.start + prev.code.split("\n").length) : 0;
            return (
              <span key={si}>
                {gap > 0 ? <span className="smc-fold" aria-label={`${gap} lines omitted`}>⋯ {gap} lines</span> : null}
                {lines.map((line, li) => (
                  <span key={li} className="smc-ln" style={{ animationDelay: `${Math.min(row++, 40) * 14}ms` }}>
                    <span className="smc-no" aria-hidden="true">{s.start + li}</span>
                    {highlightLine(line, file.lang).map((tk, ti) =>
                      tk.t === "plain" ? tk.v : <span key={ti} className={"tk-" + tk.t}>{tk.v}</span>,
                    )}
                    {"\n"}
                  </span>
                ))}
              </span>
            );
          })}
        </code>
      </pre>
      <div className="smc-status">
        <span>{LANG_LABEL[file.lang]}</span>
        <span>{p.repo?.split("/").slice(-2).join("/")}</span>
      </div>
    </div>
  );
}

function Browser({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="smc-browser">
      <div className="smc-bar">
        <span className="smc-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="smc-url">{url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
        <a href={url} target="_blank" rel="noopener" className="smc-open">Open ↗</a>
      </div>
      <div className="smc-frame">
        {!loaded ? <span className="smc-loading" aria-hidden="true">loading preview…</span> : null}
        <iframe src={url} title={`Live preview: ${title}`} loading="lazy" onLoad={() => setLoaded(true)} sandbox="allow-scripts allow-same-origin allow-popups" />
      </div>
    </div>
  );
}

function Install({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="smc-install">
      <code><span aria-hidden="true">$ </span>{cmd}</code>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(cmd).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }, () => {});
        }}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}
