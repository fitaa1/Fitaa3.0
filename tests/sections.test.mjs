// The home page's sections come from one list, `sections` in src/config/site.ts (Nigel, 25 Nov 2026: any section
// can be moved, hidden or removed). This holds that list and the menu together: every menu link that jumps to a
// section must find that section on the built page, so hiding a section never leaves a dead link behind.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const site = fs.readFileSync(path.join(root, "src/config/site.ts"), "utf8");
const built = path.join(root, "dist/index.html");

test("the section list names only sections the page knows", () => {
  const list = site.match(/sections:\s*\[([^\]]+)\]/)[1].match(/"([a-zA-Z]+)"/g).map((s) => s.slice(1, -1));
  const known = fs.readFileSync(path.join(root, "src/pages/Home.tsx"), "utf8").match(/export const SECTIONS[^=]*= \{([^}]+)\}/)[1];
  for (const name of list) assert.match(known, new RegExp(`\\b${name}:`), `${name} is in site.ts but not in SECTIONS in Home.tsx`);
});

test("every menu link that jumps to a section finds it on the built page", { skip: !fs.existsSync(built) && "run npm run build first" }, () => {
  const html = fs.readFileSync(built, "utf8");
  const nav = site.match(/nav:\s*\[([\s\S]*?)\]/)[1];
  for (const [, id] of nav.matchAll(/href:\s*"#([^"]+)"/g)) assert.match(html, new RegExp(`id="${id}"`), `the menu links to #${id} but no section on the page has that id`);
});
