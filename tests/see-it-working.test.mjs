// Reality view (SITE_STANDARD.md, 6): See it working shows the exact message each package's button sends.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { siteConfig } from "../src/config/site.ts";
const src = fs.readFileSync(new URL("../src/components/SeeItWorking.tsx", import.meta.url), "utf8");
const sw = fs.readFileSync(new URL("../src/components/SlideSwitch.tsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/index.css", import.meta.url), "utf8");

test("every package with a message has a short name for the switch", () => {
  for (const s of siteConfig.services.filter((s) => s.whatsapp)) {
    assert.ok(s.short && s.short.length <= 8, `${s.title} needs a short name of 8 letters or fewer`);
  }
});

test("the chat and its link use the package's own message from site.ts, never typed into the component", () => {
  assert.match(src, /<WhatsAppChat message=\{current\.whatsapp\}/);
  assert.match(src, /waLink\(current\.whatsapp\)/);
  assert.doesNotMatch(src, /I'm interested in/);
});

test("the switch slides by transform only and is real buttons with aria-pressed", () => {
  assert.match(sw, /aria-pressed=\{o\.value === value\}/);
  const pill = css.match(/\.slide-switch__pill \{[^}]*\}/)[0];
  assert.match(pill, /transform: translate3d\(calc\(var\(--i\) \* 100%\)/);
  assert.match(pill, /transition: transform [^;]*;/);
  assert.doesNotMatch(pill, /transition:[^;]*(left|width)/);
});
