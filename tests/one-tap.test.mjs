// One tap is one click (Nigel, 20 Nov 2026). On a phone, Safari treats the first tap as a hover when a :hover rule
// changes how something looks, and only the second tap clicks. Every :hover rule must sit inside
// @media (hover: hover), so phones never see it. This lists any that don't.
function bareHover(css) {
  const text = String(css).replace(/\/\*[\s\S]*?\*\//g, "");
  const stack = [], found = [];
  let head = "";
  for (const ch of text) {
    if (ch === "{") { stack.push(head.trim()); head = ""; }
    else if (ch === "}") { stack.pop(); head = ""; }
    else if (ch === ";") head = "";
    else head += ch;
    if (ch === "{") {
      const h = stack[stack.length - 1];
      if (!h.startsWith("@") && h.includes(":hover") && !stack.slice(0, -1).some((a) => /\(\s*(any-)?hover\s*:\s*hover\s*\)/.test(a))) found.push(h);
    }
  }
  return found;
}
const stylesOf = (file, text) => (/\.css$/.test(file) ? text : [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n"));

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? (/node_modules|dist|\.astro/.test(n) ? [] : walk(p)) : [p]; });
const FILES = ['src', 'public'].flatMap((d) => { try { return walk(join(ROOT, d)); } catch { return []; } }).filter((f) => /\.(css|html|astro)$/.test(f));

test("every hover effect is for a mouse only, so one tap is one click on a phone", () => {
  assert.ok(FILES.length > 0);
  const bare = FILES.flatMap((f) => bareHover(stylesOf(f, readFileSync(f, "utf8"))).map((s) => `${f.replace(ROOT, "")}: ${s}`));
  assert.deepEqual(bare, []);
});

test("no hover listener can change the screen on a phone: hover handlers check for a mouse", () => {
  const code = FILES.length ? ['src', 'public'].flatMap((d) => { try { return walk(join(ROOT, d)); } catch { return []; } }).filter((f) => /\.(js|mjs|ts|tsx|jsx|astro|html)$/.test(f)) : [];
  const bad = code.flatMap((f) => [...readFileSync(f, "utf8").matchAll(/onMouse(Enter|Over)|addEventListener\(\s*["'](mouseover|mouseenter)["']/g)].map((m) => `${f.replace(ROOT, "")}: ${m[0]}`));
  assert.deepEqual(bad, []);
});

// iPad Safari can report a mouse-style pointer, so a hover rule inside @media (hover: hover) still lit up under a
// finger and links needed two taps (Nigel, 24 Nov 2026). Every hover rule also needs the mouse class, which a small
// script at the top of each page adds only when a mouse moves and removes on any touch. Tailwind's hover: and
// group-hover: classes get it from the hover variant in src/index.css.
const MOUSE = /^(?:html:where\(\.mouse\)|\.dark:where\(\.mouse\)|:root:where\(\.mouse\)|:where\(html\.mouse\)\s)/;
function ungated(css) {
  const text = String(css).replace(/\/\*[\s\S]*?\*\//g, "");
  return [...text.matchAll(/([^{};]*:hover[^{};]*)\{/g)].flatMap((m) => {
    const head = m[1].trim();
    if (head.startsWith("@")) return [];
    const parts = []; let depth = 0, cur = "";
    for (const ch of head) { if ("([".includes(ch)) depth++; if (")]".includes(ch)) depth--; if (ch === "," && !depth) { parts.push(cur); cur = ""; } else cur += ch; }
    parts.push(cur);
    return parts.map((s) => s.trim()).filter((s) => s.replace(/:not\([^)]*\)/g, "").includes(":hover") && !MOUSE.test(s));
  });
}

test("every hover rule waits for a real mouse, so one tap is one click on an iPad too", () => {
  const bad = FILES.flatMap((f) => ungated(stylesOf(f, readFileSync(f, "utf8"))).map((s) => `${f.replace(ROOT, "")}: ${s}`));
  assert.deepEqual(bad, []);
  const pages = ["index.html", ...FILES.filter((f) => /\.html$/.test(f) && /:hover/.test(readFileSync(f, "utf8"))).map((f) => f.replace(ROOT, ""))];
  const noScript = pages.filter((p) => !/pointerType==="mouse"\)d\.classList\.add\("mouse"\)/.test(readFileSync(join(ROOT, p), "utf8")) || !/pointerType!=="mouse"\)d\.classList\.remove\("mouse"\)/.test(readFileSync(join(ROOT, p), "utf8")));
  assert.deepEqual(noScript, []);
  assert.match(readFileSync(join(ROOT, "src/index.css"), "utf8"), /@custom-variant hover \{\s*@media \(hover: hover\) \{\s*:where\(html\.mouse\) &:hover \{ @slot; \}/);
});

test("the built site's hover classes wait for a real mouse too", { skip: !(() => { try { return statSync(join(ROOT, "dist/assets")).isDirectory(); } catch { return false; } })() }, () => {
  const css = readdirSync(join(ROOT, "dist/assets")).filter((n) => n.endsWith(".css")).map((n) => readFileSync(join(ROOT, "dist/assets", n), "utf8")).join("\n");
  const bad = [...css.matchAll(/([^{};]*:hover[^{};]*)\{/g)].map((m) => m[1].trim()).filter((s) => !s.startsWith("@") && s.replace(/:not\([^)]*\)/g, "").includes(":hover") && !/mouse/.test(s));
  assert.deepEqual(bad, []);
});
