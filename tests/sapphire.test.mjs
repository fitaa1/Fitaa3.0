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

test("the press confirms with transform and opacity, once, and never on reduced motion", () => {
  const js = read("public/press.js");
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(js, /infinite/);
  const frames = js.match(/@keyframes[^"]+/g).join(" ");
  assert.doesNotMatch(frames, /width|height|top|left|margin/, "keyframes move only transform and opacity");
  assert.doesNotMatch(js, /box-shadow:|fitaa-halo/, "no ring or square halo around the edge (Nigel, 25 Nov 2026)");
});

test("the press answers by shape: light inside a defined edge, a round glow around what floats", () => {
  const js = read("public/press.js");
  assert.match(js, /\.fitaa-press-light\{overflow:hidden/, "the light is clipped to the element");
  assert.match(js, /\.fitaa-press-glow i\{inset:0;background:radial-gradient\(circle/, "the glow is round");
  assert.match(js, /data-press/, "a page can set light or glow where the shape misleads");
  assert.match(js, /Math\.min\([^;]*168\)/, "the glow is sized from the element, with a ceiling");
});

test("the press follows its element on scroll and can never widen the page", () => {
  const js = read("public/press.js");
  assert.match(js, /\.fitaa-press-layer\{position:fixed;inset:0;overflow:hidden/, "one fixed layer the size of the screen, clipped");
  assert.match(js, /function tick\(\)[\s\S]*?place\(live\[i\]\)[\s\S]*?requestAnimationFrame\(tick\)/, "moved with its element every frame");
  assert.match(js, /function place\(p\)\s*\{\s*var r = p\.shape\.getBoundingClientRect\(\)/, "placed from where the element is now");
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
  assert.match(svg, /^<svg[^>]+viewBox="0 0 44\.2 32\.2"/);
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
