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
