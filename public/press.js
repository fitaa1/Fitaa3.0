/* The Fitaa press (SITE_STANDARD.md, Craft in the details). Nigel, 24 Nov 2026: a press should confirm itself
   beautifully, the way a Patek Philippe pusher answers the finger. It answers in one of two ways, chosen by the shape
   of what was pressed (Nigel, 25 Nov 2026: responsive and intentional, not one size fits all):
   - light: a button, tile or switch with a defined edge (a border, a fill or a shadow) fills with a soft light that
     spreads from the finger inside its shape, then fades. Nothing crosses its edge.
   - glow: something that floats with no edge of its own (a logo, an icon, a text link, a link to an email or phone
     number) answers with a soft round glow centred on the finger that spreads past it, sized from the element, never
     a square.
   The edge can be the element's own, a card inside it that fills it, or the switch it is a segment of.
   data-press="light" or data-press="glow" on an element overrides the choice, data-press-shape on a part inside it
   names the shape the light fills (a tile's photo frame), and data-no-press turns it off.
   The answer follows the element while the page scrolls (it is moved with the element every frame it lives), and it
   is drawn in one fixed layer the size of the screen that clips its own overflow, so it can never widen the page.
   Transform and opacity only, gone in 0.7 s, nothing in the layout moves. Reduced motion gets no answer.
   Each site sets one colour, --press-ripple, in light and dark in its own stylesheet. This file is the reference:
   copy it unchanged to every Fitaa site. */
(function () {
  "use strict";
  var d = document;
  if (!d.addEventListener || !window.requestAnimationFrame ||
      (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;

  var C = "var(--press-ripple,hsl(224 85% 58% / .24))";
  var css =
    ".fitaa-press-layer{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:2147483646;contain:strict}" +
    ".fitaa-press-light,.fitaa-press-glow{position:absolute;left:0;top:0;will-change:transform}" +
    ".fitaa-press-light{overflow:hidden;animation:fitaa-press-fade .6s cubic-bezier(.22,1,.36,1) forwards}" +
    ".fitaa-press-light i,.fitaa-press-glow i{position:absolute;border-radius:50%;transform:scale(0)}" +
    ".fitaa-press-light i{background:radial-gradient(circle," + C + " 0,transparent 68%);" +
    "animation:fitaa-press-grow .6s cubic-bezier(.22,1,.36,1) forwards}" +
    ".fitaa-press-glow i{inset:0;background:radial-gradient(circle," + C + " 0," + C + " 22%,transparent 70%);" +
    "animation:fitaa-press-grow .7s cubic-bezier(.22,1,.36,1) forwards,fitaa-press-fade .7s cubic-bezier(.22,1,.36,1) forwards}" +
    "@keyframes fitaa-press-fade{0%,40%{opacity:1}100%{opacity:0}}" +
    "@keyframes fitaa-press-grow{from{transform:scale(.25)}to{transform:scale(1)}}";

  var TAPPABLE = 'button,[role="button"],summary,a,label[for],[data-press]';
  var layer = null, live = [], ticking = false;

  function setup() {
    var style = d.createElement("style");
    style.textContent = css;
    (d.head || d.documentElement).appendChild(style);
    layer = d.createElement("div");
    layer.className = "fitaa-press-layer";
    layer.setAttribute("aria-hidden", "true");
    d.body.appendChild(layer);
  }

  function transparent(color) {
    return !color || color === "transparent" || /rgba?\([^)]*,\s*0\)$/.test(color) || / \/ 0\)$/.test(color);
  }

  function edged(cs) {
    var sides = ["Top", "Right", "Bottom", "Left"];
    for (var i = 0; i < 4; i++) {
      var b = "border" + sides[i];
      if (parseFloat(cs[b + "Width"]) > 0 && cs[b + "Style"] !== "none" && !transparent(cs[b + "Color"])) return true;
    }
    if (!transparent(cs.backgroundColor) || cs.backgroundImage !== "none") return true;
    return !!cs.boxShadow && cs.boxShadow !== "none";
  }

  // What answers, and inside which shape. A defined edge is a visible border, a fill or a shadow: on the element
  // itself, on a card inside it that fills it (a tile whose link wraps its card), or on the switch it is one
  // segment of (a tab or a pressed button in a row with an edge). Anything else floats and gets the glow.
  function answer(el, cs) {
    var set = el.getAttribute("data-press"), marked = el.querySelector("[data-press-shape]");
    if (set === "glow" || cs.display === "inline") return { kind: "glow", shape: el };
    if (set === "light" || edged(cs)) return { kind: "light", shape: marked || el };
    var r = el.getBoundingClientRect(), area = r.width * r.height, kids = el.querySelectorAll("*");
    for (var i = 0; i < kids.length && i < 40; i++) {
      var k = kids[i].getBoundingClientRect();
      if (k.width * k.height >= area * 0.85 && edged(getComputedStyle(kids[i]))) return { kind: "light", shape: kids[i] };
    }
    var row = el.parentElement;
    if (row && (el.getAttribute("role") === "tab" || el.hasAttribute("aria-pressed")) &&
        /^(tablist|group|radiogroup)$/.test(row.getAttribute("role") || "") && edged(getComputedStyle(row))) {
      return { kind: "light", shape: el };
    }
    return { kind: "glow", shape: el };
  }

  // Every frame an answer lives, it is moved to where its element now is, so it scrolls with the page.
  function place(p) {
    var r = p.shape.getBoundingClientRect();
    if (p.kind === "light") p.node.style.transform = "translate3d(" + r.left + "px," + r.top + "px,0)";
    else p.node.style.transform = "translate3d(" + (r.left + p.fx - p.size / 2) + "px," + (r.top + p.fy - p.size / 2) + "px,0)";
  }
  function tick() {
    for (var i = 0; i < live.length; i++) place(live[i]);
    if (live.length) requestAnimationFrame(tick); else ticking = false;
  }

  d.addEventListener("pointerdown", function (e) {
    if (e.button > 0 || !e.target.closest) return;
    var el = e.target.closest(TAPPABLE);
    if (!el || el.disabled || el.getAttribute("aria-disabled") === "true" || el.closest("[data-no-press]")) return;
    var cs = getComputedStyle(el);
    if (cs.visibility === "hidden") return;
    var r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    if (!layer) setup();

    var a = answer(el, cs), kind = a.kind, shape = a.shape;
    if (shape !== el) { cs = getComputedStyle(shape); r = shape.getBoundingClientRect(); }
    var node = d.createElement("span"), light = d.createElement("i");
    var p = { shape: shape, kind: kind, node: node, fx: e.clientX - r.left, fy: e.clientY - r.top, size: 0 };
    if (kind === "light") {
      node.className = "fitaa-press-light";
      node.style.cssText = "width:" + r.width + "px;height:" + r.height + "px;border-radius:" + cs.borderRadius;
      var reach = Math.hypot(Math.max(p.fx, r.width - p.fx), Math.max(p.fy, r.height - p.fy)) * 2.2;
      light.style.cssText = "width:" + reach + "px;height:" + reach + "px;left:" + (p.fx - reach / 2) + "px;top:" + (p.fy - reach / 2) + "px";
    } else {
      // Sized from the element: a little wider than its own height reaches, never a wash across the page.
      p.size = Math.max(72, Math.min(Math.max(r.width, r.height) * 1.6, r.height * 3.2, 168));
      node.className = "fitaa-press-glow";
      node.style.cssText = "width:" + p.size + "px;height:" + p.size + "px";
    }
    node.appendChild(light);
    place(p);
    layer.appendChild(node);
    live.push(p);
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
    setTimeout(function () {
      node.remove();
      live.splice(live.indexOf(p), 1);
    }, 750);
  }, { passive: true });
})();
