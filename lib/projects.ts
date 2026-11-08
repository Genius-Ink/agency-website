// Projects shown in the "Show me the code" drawer. Snippets are excerpts from the public repos,
// with `start` set to the line they begin on so the line numbers and GitHub links match the source.

export type ProjectKind = "web" | "mobile" | "package" | "backend";
export type Lang = "dart" | "ts" | "js" | "yaml";

export type Snippet = { start: number; code: string };

export type Project = {
  id: string;
  title: string;
  kind: ProjectKind;
  year: string;
  summary: string;
  stack: string[];
  highlights: string[];
  featured?: boolean;
  stars?: number;
  forks?: number;
  repo?: string;
  live?: string;
  pub?: string;
  install?: string;
  /** Embed `live` in a browser frame. */
  preview?: boolean;
  file?: { path: string; lang: Lang; branch?: string; snippets: Snippet[] };
};

export const KIND_LABEL: Record<ProjectKind, string> = {
  web: "Web",
  mobile: "Mobile",
  package: "Packages",
  backend: "Backend & DevOps",
};

const GH = "https://github.com/Davies-K";

export const projects: Project[] = [
  {
    id: "wit-summit",
    title: "WIT Summit Kenya",
    kind: "web",
    year: "2026",
    summary:
      "Event platform for the second Women In Tech Summit Kenya: live countdown, speaker line-up, a two-day agenda, ticket tiers with RSVP, and sponsor and partner sections.",
    stack: ["Next.js", "React", "Event tech"],
    highlights: ["Live countdown to opening day", "Agenda, speakers and ticketing flow", "Ongoing tech support for the organisers"],
    featured: true,
    live: "https://summit.womenintechblog.dev/",
    preview: true,
  },
  {
    id: "flutter-web-portfolio",
    title: "Interactive portfolio",
    kind: "web",
    year: "2022",
    summary:
      "A story-driven portfolio built entirely with Flutter Web, so one codebase ships to browsers as well as phones. Adaptive breakpoints switch between desktop and mobile layouts.",
    stack: ["Flutter Web", "Dart", "auto_route"],
    highlights: ["Orientation-aware breakpoints", "Separate web and mobile navigation", "Deployed to GitHub Pages by CI"],
    stars: 3,
    repo: `${GH}/flutter-web-portfolio`,
    live: "https://davies-k.github.io/flutter-web-portfolio/",
    preview: true,
    file: {
      path: "lib/presentation/layout/adaptive.dart",
      lang: "dart",
      snippets: [
        {
          start: 5,
          code: `enum DisplayType {
  desktop,
  mobile,
}

const _desktopPortraitBreakpoint = 700.0;
const _desktopLandscapeBreakpoint = 1000.0;
const _ipadProBreakpoint = 1000.0;

/// Returns the [DisplayType] for the current screen. This app only supports
/// mobile and desktop layouts, and as such we only have one breakpoint.
DisplayType displayTypeOf(BuildContext context) {
  final orientation = MediaQuery.of(context).orientation;
  final width = MediaQuery.of(context).size.width;

  if ((orientation == Orientation.landscape &&
          width > _desktopLandscapeBreakpoint) ||
      (orientation == Orientation.portrait &&
          width > _desktopPortraitBreakpoint)) {
    return DisplayType.desktop;
  } else {
    return DisplayType.mobile;
  }
}`,
        },
      ],
    },
  },
];

export function fileUrl(p: Project): string | undefined {
  if (!p.repo || !p.file) return undefined;
  const first = p.file.snippets[0];
  const last = p.file.snippets[p.file.snippets.length - 1];
  const end = last.start + last.code.split("\n").length - 1;
  return `${p.repo}/blob/${p.file.branch ?? "HEAD"}/${p.file.path}#L${first.start}-L${end}`;
}
