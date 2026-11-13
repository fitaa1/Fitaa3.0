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
  assert.match(indexCss, /\.btn-cta \.cta-label/, "CSS rule .btn-cta .cta-label exists");
  assert.match(indexCss, /min-width:\s*\d+ch/, "min-width in ch present in CSS");
  assert.match(indexCss, /animation: cta-label-in/, "fade-in animation present");
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
