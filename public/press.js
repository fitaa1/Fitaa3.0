/* The Fitaa press (SITE_STANDARD.md, Craft in the details). Nigel, 24 Nov 2026: a press should confirm itself
   beautifully, the way a Patek Philippe pusher answers the finger. When a button, a link styled as one or a card
   is pressed, a soft light spreads from the finger inside its shape and a thin halo in the site's own colour lifts
   just past its edge, then both fade. Nothing moves the layout: one span over the element, transform and opacity
   only, gone in 0.6 s. A plain text link inside a sentence is left alone. Reduced motion gets no light.
   Each site sets its colour with --press (the ring), --press-glow and --press-ripple. This file is the reference:
   copy it unchanged to every Fitaa site and set the three colours in that site's stylesheet. */
(function () {
  "use strict";
  var d = document;
  if (!d.addEventListener || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  var css = ".fitaa-halo{position:fixed;z-index:2147483646;pointer-events:none;overflow:hidden;opacity:0;" +
    "box-shadow:0 0 0 1px var(--press,hsl(224 76% 45%)),0 0 22px 1px var(--press-glow,hsl(224 76% 50% / .32));" +
    "animation:fitaa-halo .6s cubic-bezier(.22,1,.36,1) forwards}" +
    ".fitaa-halo i{position:absolute;border-radius:50%;transform:scale(0);" +
    "background:radial-gradient(circle,var(--press-ripple,hsl(224 85% 58% / .26)) 0,transparent 68%);" +
    "animation:fitaa-ripple .6s cubic-bezier(.22,1,.36,1) forwards}" +
    "@keyframes fitaa-halo{0%{opacity:0;transform:scale(1)}18%{opacity:1}100%{opacity:0;transform:scale(1.045)}}" +
    "@keyframes fitaa-ripple{to{transform:scale(1)}}";
  var style = d.createElement("style");
  style.textContent = css;
  (d.head || d.documentElement).appendChild(style);

  var TAPPABLE = 'button,[role="button"],summary,a,label[for],[data-press]';
  d.addEventListener("pointerdown", function (e) {
    if (e.button > 0 || !e.target.closest) return;
    var el = e.target.closest(TAPPABLE);
    if (!el || el.disabled || el.getAttribute("aria-disabled") === "true" || el.closest("[data-no-press]")) return;
    var cs = getComputedStyle(el);
    if (cs.display === "inline" || cs.visibility === "hidden") return; // a link inside a sentence stays a link
    var r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    var halo = d.createElement("span");
    halo.className = "fitaa-halo";
    halo.setAttribute("aria-hidden", "true");
    halo.style.cssText = "left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px;border-radius:" + cs.borderRadius;
    var size = Math.hypot(r.width, r.height) * 2;
    var dot = d.createElement("i");
    dot.style.cssText = "width:" + size + "px;height:" + size + "px;left:" + (e.clientX - r.left - size / 2) + "px;top:" + (e.clientY - r.top - size / 2) + "px";
    halo.appendChild(dot);
    d.body.appendChild(halo);
    setTimeout(function () { halo.remove(); }, 650);
  }, { passive: true });
})();
