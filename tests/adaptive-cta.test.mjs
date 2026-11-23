// Tests for the adaptive CTA (SITE_STANDARD.md, Controls that adapt)
// The CTA labels and messages are in site.ts, and the header button is hidden in the Contact section.
import { test } from "node:test";
import assert from "node:assert/strict";
import { siteConfig } from "../src/config/site.ts";
import { useAdaptiveCta, chooseCta } from "../src/hooks/useAdaptiveCta.ts";
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const services = siteConfig.services;

test("each section has a data-cta-label and data-cta-message in site.ts", () => {
  // Hero
  assert.ok(siteConfig.hero?.dataCtaLabel && siteConfig.hero?.dataCtaMessage);
  // Services section (the parent)
  assert.ok(siteConfig.servicesSection?.dataCtaLabel && siteConfig.servicesSection?.dataCtaMessage);
  // Each service in Services array
  for (const s of services) {
    assert.ok(s.dataCtaLabel && s.dataCtaMessage, `missing label for ${s.title}`);
  }
  // WhyUs
  assert.ok(siteConfig.whyUsSection?.dataCtaLabel && siteConfig.whyUsSection?.dataCtaMessage);
  // Work (FeaturedWork)
  assert.ok(siteConfig.workSection?.dataCtaLabel && siteConfig.workSection?.dataCtaMessage);
  // Testimonials
  assert.ok(siteConfig.testimonialsSection?.dataCtaLabel && siteConfig.testimonialsSection?.dataCtaMessage);
  // Contact (FinalCTA) has its own copy in site.ts
  assert.ok(siteConfig.contactSection?.dataCtaLabel && siteConfig.contactSection?.dataCtaMessage);
});

test("all labels are non-empty", () => {
  const allLabels = [
    siteConfig.hero?.dataCtaLabel,
    siteConfig.servicesSection?.dataCtaLabel,
    siteConfig.whyUsSection?.dataCtaLabel,
    siteConfig.workSection?.dataCtaLabel,
    siteConfig.testimonialsSection?.dataCtaLabel,
    siteConfig.contactSection?.dataCtaLabel,
  ];
  for (const l of allLabels) assert.ok(l && l.length > 0, `label is empty: ${l}`);
  for (const s of services) assert.ok(s.dataCtaLabel && s.dataCtaLabel.length > 0, `service label empty for ${s.title}`);
});

test("the reserved width CSS exists in index.css", () => {
  const indexCss = fs.readFileSync(path.join(root, "..", "src", "index.css"), "utf8");
  assert.match(indexCss, /\.floating-wa \.cta-label/, "the floating button reserves its label's width");
  assert.match(indexCss, /min-width:\s*\d+ch/, "min-width in ch present in CSS");
});

test("the useAdaptiveCta hook exports a function", () => {
  assert.equal(typeof useAdaptiveCta, "function");
});

test("one card on the middle line names its package, three side by side name the section or the open card", () => {
  const el = (tag, open) => ({ tagName: tag, getAttribute: (k) => (k === "data-open" ? String(!!open) : null) });
  const section = el("SECTION"), a = el("LI"), b = el("LI"), c = el("LI", true);
  assert.equal(chooseCta([section, a]), a, "a phone: the one card in view");
  assert.equal(chooseCta([section, a, b]), section, "side by side with none open: the section");
  assert.equal(chooseCta([section, a, b, c]), c, "side by side with one open: that card");
  assert.equal(chooseCta([]), null, "nothing on the line keeps the last label");
});

import { scrambleFrame } from "../src/lib/scramble.ts";

test("the header button never changes: only the floating WhatsApp button follows the section", () => {
  const nav = fs.readFileSync(path.join(root, "..", "src", "components", "Navbar.tsx"), "utf8");
  assert.doesNotMatch(nav, /useAdaptiveCta/);
  assert.match(nav, /\{siteConfig\.hero\.dataCtaLabel\}/);
  // The header button keeps its gold fill (Nigel, 22 Nov 2026: the outline read as lost styling).
  assert.match(nav, /className="btn-gold hidden lg:inline-flex/);
  const wa = fs.readFileSync(path.join(root, "..", "src", "components", "FloatingWhatsApp.tsx"), "utf8");
  assert.match(wa, /useAdaptiveCta/);
  assert.match(wa, /<CodedLabel/);
});

test("the label rewrites itself in 0s and 1s and always ends on the exact words", () => {
  const from = "GET IN TOUCH", to = "ASK ABOUT GET CHOSEN";
  assert.equal(scrambleFrame(from, to, 1), to);
  assert.equal(scrambleFrame(from, to, 1.4), to);
  const mid = scrambleFrame(from, to, 0.2, () => 0.1);
  assert.match(mid, /^[01 ]+$/, "early on it is all code");
  assert.ok(mid.length > from.length && mid.length < to.length, "the length walks from one to the other");
  const late = scrambleFrame(from, to, 0.8, () => 0.9);
  assert.ok(late.startsWith("ASK ABOUT"), "the start settles first");
  assert.equal(scrambleFrame(to, "GET IN TOUCH", 0.3, () => 0.1).length < to.length, true);
});
