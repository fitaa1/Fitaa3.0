/* The Fitaa press (SITE_STANDARD.md, Craft in the details). Nigel, 24 Nov 2026: a press should confirm itself
   beautifully, the way a Patek Philippe pusher answers the finger. When a button, a link styled as one or a card
   is pressed, a soft light in the site's own colour spreads from the finger inside its shape, then fades. There is
   no ring or halo around the edge (Nigel, 25 Nov 2026: the light is right, the square halo was not). Nothing moves
   the layout: one span over the element, clipped to its shape, transform and opacity only, gone in 0.6 s. A plain
   text link inside a sentence is left alone. Reduced motion gets no light.
   Each site sets the colour of the light with --press-ripple. This file is the reference: copy it unchanged to
   every Fitaa site and set that one colour, in light and dark, in the site's stylesheet. */
(function () {
  "use strict";
  var d = document;
  if (!d.addEventListener || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  var css = ".fitaa-press{position:fixed;z-index:2147483646;pointer-events:none;overflow:hidden;" +
    "animation:fitaa-press-fade .6s cubic-bezier(.22,1,.36,1) forwards}" +
    ".fitaa-press i{position:absolute;border-radius:50%;transform:scale(0);" +
    "background:radial-gradient(circle,var(--press-ripple,hsl(224 85% 58% / .26)) 0,transparent 68%);" +
    "animation:fitaa-press-light .6s cubic-bezier(.22,1,.36,1) forwards}" +
    "@keyframes fitaa-press-fade{0%,45%{opacity:1}100%{opacity:0}}" +
    "@keyframes fitaa-press-light{to{transform:scale(1)}}";
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
    var clip = d.createElement("span");
    clip.className = "fitaa-press";
    clip.setAttribute("aria-hidden", "true");
    clip.style.cssText = "left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px;border-radius:" + cs.borderRadius;
    var size = Math.hypot(r.width, r.height) * 2;
    var light = d.createElement("i");
    light.style.cssText = "width:" + size + "px;height:" + size + "px;left:" + (e.clientX - r.left - size / 2) + "px;top:" + (e.clientY - r.top - size / 2) + "px";
    clip.appendChild(light);
    d.body.appendChild(clip);
    setTimeout(function () { clip.remove(); }, 650);
  }, { passive: true });
})();
