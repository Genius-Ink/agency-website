// Tiny syntax highlighter for the code drawer. It's line-based (no multi-line strings or block
// comments), which is all the snippets need, and keeps a highlighting library out of the bundle.
import type { Lang } from "./projects";

export type TokenType = "com" | "str" | "num" | "kw" | "type" | "fn" | "attr" | "key" | "plain";
export type Token = { t: TokenType; v: string };

const KEYWORDS: Record<Lang, Set<string>> = {
  dart: new Set(
    "abstract as async await break case catch class const continue default else enum extends final for if import in is late new null required return static super switch this throw true false try var void while with".split(" "),
  ),
  ts: new Set(
    "as async await break case catch class const continue default else export extends false for from function if import in interface let new null private public return static switch this throw true try type typeof undefined var void while".split(" "),
  ),
  js: new Set(
    "async await break case catch class const continue default else export false for function if in let new null require return switch this throw true try undefined var while".split(" "),
  ),
  yaml: new Set(["true", "false", "null"]),
};

const CODE_RE = /(\/\/.*$)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|(@\w+)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;
const YAML_RE = /(#.*$)|('(?:[^'])*'|"(?:\\.|[^"\\])*")|(^\s*-?\s*[A-Za-z_][\w.-]*(?=:))|(\b\d+(?:\.\d+)?\b)/g;

export function highlightLine(line: string, lang: Lang): Token[] {
  const out: Token[] = [];
  const re = lang === "yaml" ? YAML_RE : CODE_RE;
  const kw = KEYWORDS[lang];
  let last = 0;
  re.lastIndex = 0;
  for (let m = re.exec(line); m; m = re.exec(line)) {
    if (m.index > last) out.push({ t: "plain", v: line.slice(last, m.index) });
    const [v, com, str, third, num] = m;
    let t: TokenType = "plain";
    if (com) t = "com";
    else if (str) t = "str";
    else if (third) t = lang === "yaml" ? "key" : "attr";
    else if (num) t = "num";
    else if (kw.has(v)) t = "kw";
    else if (/^[A-Z]/.test(v)) t = "type";
    else if (line[m.index + v.length] === "(") t = "fn";
    out.push({ t, v });
    last = m.index + v.length;
  }
  if (last < line.length) out.push({ t: "plain", v: line.slice(last) });
  return out;
}
