// Royal sapphire and the Fitaa press (SITE_STANDARD.md, Royal sapphire and Craft in the details; Nigel, 24 and 25
// Nov 2026). Every copy of the home page and Fully Booked carries the press and one sapphire on the seam under the
// hero. The press answers a defined edge with light inside it and a floating thing with a round glow, follows its
// element while the page scrolls, and draws in one fixed layer that clips its own overflow. The sapphire clips its
// own glint. Both are transform and opacity only, once, and the colour tokens exist in light and dark.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PAGES } from "../middleware.ts";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const dist = path.join(root, "dist");
const built = fs.existsSync(path.join(dist, "_r"));

test("the press moves only transform and opacity, and never on reduced motion", () => {
  const js = read("public/press.js");
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(js, /infinite|@keyframes/);
  const transitions = js.match(/transition:[^;"}]+/g).join(" ");
  assert.doesNotMatch(transitions.replace(/transition:/g, ""), /width|height|top|left|margin/, "only transform and opacity change");
  assert.doesNotMatch(js, /box-shadow:|fitaa-halo/, "never a ring or square halo (Nigel, 25 Nov 2026)");
});

test("the press takes the shape of what was pressed (Nigel, 25 Nov 2026: bespoke, not generic)", () => {
  const js = read("public/press.js");
  assert.match(js, /function radiusOf\(cs, w, h\)/, "reads each element's own corner radius");
  assert.match(js, /rad: Math\.min\(rad \+ s, \(h \+ 2 \* s\) \/ 2\)/, "a glow is the element's outline grown outward, not a circle");
  assert.match(js, /bloom = \{ x: r\.left, y: r\.top, w: w, h: h, rad: rad \}/, "a light fills the element's own outline");
  assert.match(js, /el\.getClientRects\(\)/, "a wrapped link glows round the line that was touched");
  assert.match(js, /data-press/, "a page can set light or glow where the shape misleads");
  assert.match(js, /function vivid\(cs\)/, "a strong fill catches a white sheen, not a light that vanishes into it");
});

test("the answer is held by the finger and rides along a switch", () => {
  const js = read("public/press.js");
  assert.match(js, /addEventListener\("pointerup"/, "it lasts until the finger lifts");
  assert.match(js, /addEventListener\("pointercancel", function \(e\) \{ end\(e\.pointerId, true\)/, "a scroll lets it go at once");
  assert.match(js, /p\.kind === "switch"/, "on a switch the light follows the finger along the row");
  assert.match(js, /data-glide/);
});

test("the press stays inside a floating bar, rides with the page, and never widens it", () => {
  const js = read("public/press.js");
  assert.doesNotMatch(js, /requestAnimationFrame|addEventListener\("scroll"/, "the browser carries it, no script moves it with the page");
  assert.match(js, /if \(edged\(cs\)\) return \{ fixed: true, x0: Math\.max\(0, r\.left\)/, "inside a bar with a background, never past it");
  assert.match(js, /var ox = g\.fixed \? 0 : scrollX/, "drawn in the page beside its element");
  assert.match(js, /x1 = Math\.min\(g\.x1, clip\.x \+ clip\.w\)/, "cut to the page's width");
});

test("sapphire and press colours exist in light and dark on both stylesheets", () => {
  const css = read("src/index.css");
  const fb = read("public/fully-booked/index.html");
  for (const t of ["--sapphire:", "--press-ripple:"]) {
    assert.equal((css.match(new RegExp(t, "g")) || []).length, 2, `${t} in src/index.css light and dark`);
    assert.equal((fb.match(new RegExp(t, "g")) || []).length, 2, `${t} on Fully Booked light and dark`);
  }
});

test("one sapphire, one shared drawing, masking and clipping its own glint", () => {
  const svg = read("public/sapphire.svg");
  assert.match(svg, /^<svg[^>]+viewBox="0 0 41\.2 29\.2"/);
  assert.ok(!fs.existsSync(path.join(root, "public/sapphires.svg")), "the five stone drawing is gone");
  for (const f of ["src/index.css", "public/fully-booked/index.html"]) {
    const css = read(f);
    const rule = css.match(/\.sapphire\s?\{[^}]+\}/)[0];
    assert.match(rule, /overflow:\s?hidden/, `${f}: the stone clips its glint, so the page never scrolls sideways`);
    assert.match(rule, /background:\s?url\(\/sapphire\.svg\)/, f);
    assert.match(rule, /[^-]mask:\s?url\(\/sapphire\.svg\)/, `${f} masks the glint to the stone`);
  }
});

test("every copy of home and Fully Booked loads the press and carries one sapphire", { skip: !built && "run npm run build first" }, () => {
  const dirs = ["", ...fs.readdirSync(path.join(dist, "_r")).map((d) => `_r/${d}`)];
  let n = 0;
  for (const file of ["index.html", PAGES["/fully-booked"] || "fully-booked/index.html"]) {
    for (const dir of dirs) {
      const f = path.join(dist, dir, file);
      if (!fs.existsSync(f)) continue;
      const html = fs.readFileSync(f, "utf8");
      n++;
      assert.match(html, /<script defer src="\/press\.js"><\/script>/, `${dir}/${file} loads the press`);
      assert.equal((html.match(/class="sapphire-seam"/g) || []).length, 1, `${dir}/${file} has one sapphire`);
    }
  }
  assert.ok(n >= 2);
  assert.ok(fs.existsSync(path.join(dist, "press.js")) && fs.existsSync(path.join(dist, "sapphire.svg")));
});
