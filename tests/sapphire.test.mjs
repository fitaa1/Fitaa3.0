// Royal sapphire (SITE_STANDARD.md, Royal sapphire; Nigel, 24 Nov 2026). Every copy of the home page and Fully
// Booked carries the Fitaa press and two kente seams, the press stays transform and opacity only and once, and
// the sapphire tokens exist in light and dark on both stylesheets.
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
  assert.match(js, /cs\.display === "inline"/, "a link inside a sentence is left alone");
});

test("sapphire and press colours exist in light and dark on both stylesheets", () => {
  const css = read("src/index.css");
  const fb = read("public/fully-booked/index.html");
  for (const t of ["--sapphire:", "--press:", "--press-glow:", "--press-ripple:"]) {
    assert.equal((css.match(new RegExp(t, "g")) || []).length, 2, `${t} in src/index.css light and dark`);
    assert.equal((fb.match(new RegExp(t, "g")) || []).length, 2, `${t} on Fully Booked light and dark`);
  }
});

test("the kente band is one shared drawing of whole links", () => {
  const svg = read("public/kente-band.svg");
  assert.match(svg, /^<svg[^>]+viewBox="0 0 112 24"/);
  for (const f of ["src/index.css", "public/fully-booked/index.html"]) assert.match(read(f), /url\(\/kente-band\.svg\)[^;]*round no-repeat/, f);
});

test("every copy of home and Fully Booked loads the press and carries two kente seams", { skip: !built && "run npm run build first" }, () => {
  const dirs = ["", ...fs.readdirSync(path.join(dist, "_r")).map((d) => `_r/${d}`)];
  for (const file of ["index.html", PAGES["/fully-booked"] || "fully-booked/index.html"]) {
    for (const dir of dirs) {
      const f = path.join(dist, dir, file);
      if (!fs.existsSync(f)) continue;
      const html = fs.readFileSync(f, "utf8");
      assert.match(html, /<script defer src="\/press\.js"><\/script>/, `${dir}/${file} loads the press`);
      assert.equal((html.match(/class="kente-seam"/g) || []).length, 2, `${dir}/${file} has two kente seams`);
    }
  }
  assert.ok(fs.existsSync(path.join(dist, "press.js")) && fs.existsSync(path.join(dist, "kente-band.svg")));
});
