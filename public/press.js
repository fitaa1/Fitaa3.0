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
   The answer is drawn in the page beside its element, so the browser scrolls it with the page on its own, with no
   script running while it lives (Nigel, 25 Nov 2026: a tap while the page moves must not lag or leave a ghost). An
   element inside a fixed or sticky bar gets an answer fixed to the screen like its bar. Every answer is cut to the
   width of the page, so it can never make the page wider. Transform and opacity only, gone in half a second, nothing
   in the layout moves. Reduced motion gets no answer.
   Each site sets one colour, --press-ripple, in light and dark in its own stylesheet. This file is the reference:
   copy it unchanged to every Fitaa site. */
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  if (!d.addEventListener || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;

  var C = "var(--press-ripple,hsl(224 85% 58% / .24))";
  var EASE = "cubic-bezier(.22,1,.36,1)";
  var css =
    ".fitaa-press{position:absolute;left:0;top:0;overflow:hidden;pointer-events:none;z-index:2147483646;contain:layout paint}" +
    ".fitaa-press.is-fixed{position:fixed}" +
    ".fitaa-press i{position:absolute;border-radius:50%;transform:scale(.25)}" +
    ".fitaa-press-light{animation:fitaa-press-fade .45s " + EASE + " forwards}" +
    ".fitaa-press-light i{background:radial-gradient(circle," + C + " 0,transparent 68%);animation:fitaa-press-grow .45s " + EASE + " forwards}" +
    ".fitaa-press-glow{animation:fitaa-press-fade .5s " + EASE + " forwards}" +
    ".fitaa-press-glow i{background:radial-gradient(circle," + C + " 0," + C + " 20%,transparent 70%);animation:fitaa-press-grow .5s " + EASE + " forwards}" +
    "@keyframes fitaa-press-fade{0%,30%{opacity:1}100%{opacity:0}}" +
    "@keyframes fitaa-press-grow{to{transform:scale(1)}}";

  var TAPPABLE = 'button,[role="button"],summary,a,label[for],[data-press]';
  var ready = false;

  function setup() {
    var style = d.createElement("style");
    style.textContent = css;
    (d.head || root).appendChild(style);
    ready = true;
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

  // An element inside a fixed or sticky bar stays still on the screen while the page moves, so its answer does too.
  function onScreen(el) {
    for (var n = el; n && n !== root; n = n.parentElement) {
      var pos = getComputedStyle(n).position;
      if (pos === "fixed" || pos === "sticky") return true;
    }
    return false;
  }

  d.addEventListener("pointerdown", function (e) {
    if (e.button > 0 || !e.target.closest) return;
    var el = e.target.closest(TAPPABLE);
    if (!el || el.disabled || el.getAttribute("aria-disabled") === "true" || el.closest("[data-no-press]")) return;
    var cs = getComputedStyle(el);
    if (cs.visibility === "hidden") return;
    var r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    if (!ready) setup();

    var a = answer(el, cs), kind = a.kind, shape = a.shape;
    if (shape !== el) { cs = getComputedStyle(shape); r = shape.getBoundingClientRect(); }
    var fx = e.clientX - r.left, fy = e.clientY - r.top;
    // The box the answer fills, in screen terms: the element itself, or a circle round the finger sized from it.
    var box, reach, radius = "";
    if (kind === "light") {
      box = { x: r.left, y: r.top, w: r.width, h: r.height };
      reach = Math.hypot(Math.max(fx, r.width - fx), Math.max(fy, r.height - fy)) * 2.2;
      radius = cs.borderRadius;
    } else {
      // A little wider than its own height reaches, never a wash across the page.
      reach = Math.max(64, Math.min(Math.max(r.width, r.height) * 1.4, r.height * 2.8, 140));
      box = { x: e.clientX - reach / 2, y: e.clientY - reach / 2, w: reach, h: reach };
    }
    // Cut to the page's width (and, in the page, its height), so an answer never makes the page bigger.
    var fixed = onScreen(el), ox = fixed ? 0 : scrollX, oy = fixed ? 0 : scrollY;
    var maxX = root.clientWidth, maxY = fixed ? innerHeight : Math.max(root.scrollHeight - oy, innerHeight);
    var x0 = Math.max(0, box.x), y0 = Math.max(0, box.y);
    var x1 = Math.min(maxX, box.x + box.w), y1 = Math.min(maxY, box.y + box.h);
    if (x1 - x0 < 1 || y1 - y0 < 1) return;
    // A light keeps its element's rounded corners, unless the cut changed its shape.
    if (kind === "light" && (x0 !== box.x || y0 !== box.y || x1 !== box.x + box.w || y1 !== box.y + box.h)) radius = "0";

    var node = d.createElement("span"), light = d.createElement("i");
    node.className = "fitaa-press fitaa-press-" + kind + (fixed ? " is-fixed" : "");
    node.setAttribute("aria-hidden", "true");
    node.style.cssText = "transform:translate(" + (x0 + ox) + "px," + (y0 + oy) + "px);width:" + (x1 - x0) + "px;height:" +
      (y1 - y0) + "px" + (radius ? ";border-radius:" + radius : "");
    light.style.cssText = "width:" + reach + "px;height:" + reach + "px;left:" + (e.clientX - reach / 2 - x0) + "px;top:" +
      (e.clientY - reach / 2 - y0) + "px";
    node.appendChild(light);
    root.appendChild(node);
    setTimeout(function () { node.remove(); }, 560);
  }, { passive: true });
})();
