// Makes every :hover rule wait for a real mouse (Nigel, 24 Nov 2026: links needed two taps on his iPad).
// iPad Safari can report hover: hover, so a hover rule lit up under a finger and Safari held the click.
// Each selector with :hover gets the mouse class through :where(), so specificity does not change:
//   .card:hover        -> :where(html.mouse) .card:hover
//   html.dark a:hover  -> html:where(.mouse).dark a:hover
//   .dark a:hover      -> .dark:where(.mouse) a:hover     (the dark class sits on <html>)
//   :root a:hover      -> :root:where(.mouse) a:hover
// Usage: node scripts/mouse-hover.mjs <file> [...]. CSS files are rewritten whole, HTML and Astro files inside <style>.
// HTML pages also get the tiny script that adds and removes the class, as the first thing in <head>.
import { readFileSync, writeFileSync } from "node:fs";

export const SNIPPET = '<script>(function(d){addEventListener("pointermove",function(e){if(e.pointerType==="mouse")d.classList.add("mouse")},{passive:true});addEventListener("pointerdown",function(e){if(e.pointerType!=="mouse")d.classList.remove("mouse")},{passive:true})})(document.documentElement)</script>';

const gated = (s) => /^(?:html)?:where\((?:html)?\.mouse\)|^html:where\(\.mouse\)|^\.dark:where\(\.mouse\)|^:root:where\(\.mouse\)|^html\.mouse|^\.mouse[\s.]/.test(s.trim());

export function gateSelector(sel) {
  const lead = sel.match(/^(?:\s|\/\*[\s\S]*?\*\/)*/)[0], s = sel.slice(lead.length).trim();
  if (!s.replace(/:not\([^)]*\)/g, "").includes(":hover") || gated(s)) return sel;
  let m;
  if ((m = s.match(/^html(?![\w-])/))) return lead + "html:where(.mouse)" + s.slice(4);
  if (s.startsWith(":root")) return lead + ":root:where(.mouse)" + s.slice(5);
  if ((m = s.match(/^\.dark(?![\w-])/))) return lead + ".dark:where(.mouse)" + s.slice(5);
  return lead + ":where(html.mouse) " + s;
}

function splitTop(head) {
  const out = []; let depth = 0, cur = "";
  for (const ch of head) {
    if (ch === "(" || ch === "[") depth++;
    if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur); return out;
}

export function gateCss(css) {
  let out = "", head = "", i = 0;
  while (i < css.length) {
    if (css.startsWith("/*", i)) { const e = css.indexOf("*/", i + 2); const end = e < 0 ? css.length : e + 2; head += css.slice(i, end); i = end; continue; }
    const ch = css[i];
    if (ch === "{") {
      const t = head.trim();
      if (!t.startsWith("@") && t.replace(/\/\*[\s\S]*?\*\//g, "").includes(":hover")) head = splitTop(head).map(gateSelector).join(",");
      out += head + "{"; head = "";
    } else if (ch === "}" || ch === ";") { out += head + ch; head = ""; }
    else head += ch;
    i++;
  }
  return out + head;
}

export function gateFile(path) {
  const text = readFileSync(path, "utf8");
  let next;
  if (/\.css$/.test(path)) next = gateCss(text);
  else {
    next = text.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (_, a, b, c) => a + gateCss(b) + c);
    if (/\.html$/.test(path) && /:hover/.test(next) && !next.includes('d.classList.add("mouse")')) next = next.replace(/<head([^>]*)>/, (m) => m + "\n    " + SNIPPET);
  }
  if (next !== text) writeFileSync(path, next);
  return next !== text;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const f of process.argv.slice(2)) if (gateFile(f)) console.log("gated", f);
}
