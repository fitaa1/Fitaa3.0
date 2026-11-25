/* The Fitaa press (SITE_STANDARD.md, Craft in the details). Nigel, 24 Nov 2026: a press should confirm itself
   beautifully, the way a Patek Philippe pusher answers the finger. Nigel, 25 Nov 2026: one soft light, never a second
   effect on top of it, and kept where it belongs.

   It answers in one of two ways, chosen by the shape of what was pressed:
   - light: a button, tile, card or switch with a defined edge (a border, a fill or a shadow; its own, a card inside
     it that fills it, or the row it is a segment of) fills with one soft light that opens out from the finger until
     the whole of it is lit, cut to its own outline. A strong fill of its own (a gold or magenta button) catches a
     white sheen instead, because the site's own light would vanish into it (--press-sheen).
   - glow: something that floats with no edge of its own (a logo, an icon, a text link, an email address or phone
     number) glows from behind itself: one soft light the shape of the element, centred on it and reaching a little
     past it, so it emanates from the logo or the link rather than sitting on the finger. On a dark page it lights the
     page behind the element (screen blend), so the element itself stays crisp.
   While the finger rests, moving it moves the light with it, like light shifting in a stone, and on a switch the
   light rides along the row so pressing and sliding are one gesture. The light holds while the finger rests and
   fades when it lifts, when the finger starts to scroll, when a long press opens the phone's own menu, or after 1.5 s
   at most, so it can never be left behind.
   An element inside a fixed or sticky bar that has its own background (a header once it floats over the page, the
   OS section bar) is answered inside that bar only. Everything else is drawn in the page beside its element, so the
   browser carries it with the page, and every answer is cut to the page's width.
   data-press="light" or "glow" overrides the choice, data-press-shape on a part inside names the shape the light
   fills (a tile's photo frame), data-glide marks a switch row, and data-no-press turns the press off.
   Transform and opacity only, nothing in the layout moves. Reduced motion gets no answer.
   Each site sets one colour, --press-ripple, in light and dark in its own stylesheet. This file is the reference:
   copy it unchanged to every Fitaa site. */
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  if (!d.addEventListener || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;

  var C = "var(--press-ripple,hsl(224 85% 58% / .24))";
  var S = "var(--press-sheen,rgb(255 255 255 / .26))";
  var EASE = "cubic-bezier(.22,1,.36,1)";
  var GROW = "transform .45s " + EASE + ",opacity .2s ease";
  var css =
    ".fitaa-press{position:absolute;left:0;top:0;overflow:hidden;pointer-events:none;z-index:2147483646;contain:layout paint;transition:opacity .32s ease}" +
    ".fitaa-press.is-fixed{position:fixed}.fitaa-press.is-screen{mix-blend-mode:screen}" +
    ".fitaa-press.is-out{opacity:0}.fitaa-press.is-quick{transition-duration:.14s}" +
    ".fitaa-press i{position:absolute;border-radius:50%;opacity:0;will-change:transform,opacity;transition:" + GROW + "}" +
    ".fitaa-press-light i{background:radial-gradient(circle," + C + " 0,transparent 68%)}" +
    ".fitaa-press-light.is-sheen i{background:radial-gradient(circle," + S + " 0,transparent 68%)}" +
    ".fitaa-press-glow i{background:radial-gradient(closest-side," + C + " 0," + C + " 30%,transparent 100%)}" +
    ".fitaa-press.is-on i{opacity:1}";

  var TAPPABLE = 'button,[role="button"],[role="tab"],summary,a,label[for],[data-press]';
  var SEGMENT = 'button,[role="tab"],[role="radio"]';
  var HOLD = 1500;
  var ready = false, live = {};

  function setup() {
    var style = d.createElement("style");
    style.textContent = css;
    (d.head || root).appendChild(style);
    ready = true;
  }

  function rgb(color) {
    var m = /rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?/.exec(color || "");
    return m ? { r: m[1] / 255, g: m[2] / 255, b: m[3] / 255, a: m[4] == null ? 1 : +m[4] } : null;
  }
  function transparent(color) {
    var c = rgb(color);
    return !color || color === "transparent" || (c && c.a === 0);
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

  // A strong fill of its own: a gradient, or a bright or saturated colour, such as a gold or magenta button.
  function vivid(cs) {
    if (cs.backgroundImage && /gradient/.test(cs.backgroundImage)) return true;
    var c = rgb(cs.backgroundColor);
    if (!c || c.a < 0.6) return false;
    var hi = Math.max(c.r, c.g, c.b), lo = Math.min(c.r, c.g, c.b), l = (hi + lo) / 2;
    var sat = hi === lo ? 0 : (hi - lo) / (1 - Math.abs(2 * l - 1));
    return (sat > 0.35 && l > 0.25) || l > 0.6;
  }

  // Whether the page behind an element is dark, from the first solid colour found going outwards.
  function darkBehind(el) {
    for (var n = el.parentElement; n; n = n.parentElement) {
      var c = rgb(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.5) return (Math.max(c.r, c.g, c.b) + Math.min(c.r, c.g, c.b)) / 2 < 0.45;
    }
    return false;
  }

  // The corner radius of a box in pixels, from its first corner (a percentage is of its shorter side).
  function radiusOf(cs, w, h) {
    var v = String(cs.borderTopLeftRadius || "0").split(" ")[0];
    var n = parseFloat(v) || 0;
    if (/%$/.test(v)) n = (n / 100) * Math.min(w, h);
    return Math.min(n, Math.min(w, h) / 2);
  }

  // A switch: the row a segment belongs to, if the segment is one of two or more in a marked row.
  function rowOf(el) {
    var row = el.parentElement;
    if (!row) return null;
    var marked = row.hasAttribute("data-glide") || /^(tablist|radiogroup|group)$/.test(row.getAttribute("role") || "");
    if (!marked) return null;
    var n = 0;
    for (var i = 0; i < row.children.length; i++) if (row.children[i].matches && row.children[i].matches(SEGMENT)) n++;
    if (n < 2) return null;
    var segment = row.hasAttribute("data-glide") || el.getAttribute("role") === "tab" || el.getAttribute("role") === "radio" || el.hasAttribute("aria-pressed");
    return segment ? row : null;
  }

  // What answers, and inside which shape.
  function answer(el, cs) {
    var set = el.getAttribute("data-press"), marked = el.querySelector("[data-press-shape]");
    var row = set ? null : rowOf(el);
    if (row) return { kind: "light", shape: el, row: row };
    if (set === "glow" || cs.display === "inline") return { kind: "glow", shape: el };
    if (set === "light" || edged(cs)) return { kind: "light", shape: marked || el };
    var r = el.getBoundingClientRect(), area = r.width * r.height, kids = el.querySelectorAll("*");
    for (var i = 0; i < kids.length && i < 40; i++) {
      var k = kids[i].getBoundingClientRect();
      if (k.width * k.height >= area * 0.85 && edged(getComputedStyle(kids[i]))) return { kind: "light", shape: kids[i] };
    }
    return { kind: "glow", shape: el };
  }

  // Where the answer may be drawn: inside a fixed or sticky bar with its own background (and never past it), on the
  // screen for a bar without one, or in the page.
  function region(el) {
    for (var n = el; n && n !== root; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.position === "fixed" || cs.position === "sticky") {
        var r = n.getBoundingClientRect();
        if (edged(cs)) return { fixed: true, x0: Math.max(0, r.left), y0: Math.max(0, r.top), x1: Math.min(root.clientWidth, r.right), y1: Math.min(innerHeight, r.bottom) };
        return { fixed: true, x0: 0, y0: 0, x1: root.clientWidth, y1: innerHeight };
      }
    }
    return { fixed: false, x0: 0, y0: -scrollY, x1: root.clientWidth, y1: Math.max(root.scrollHeight - scrollY, innerHeight) };
  }

  function move(p, dx, dy, scale) {
    p.light.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + scale + ")";
  }

  function end(id, quick) {
    var p = live[id];
    if (!p) return;
    delete live[id];
    clearTimeout(p.hold);
    var wait = quick ? 0 : Math.max(0, 180 - (Date.now() - p.at)); // a quick tap still shows its light opening
    setTimeout(function () {
      p.node.className += quick ? " is-out is-quick" : " is-out";
      setTimeout(function () { p.node.remove(); }, quick ? 180 : 360);
    }, wait);
  }
  function endAll() { for (var id in live) end(id, false); }

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
    if (kind === "glow" && cs.display === "inline") { // the line of a wrapped link that was touched
      var lines = el.getClientRects();
      for (var li = 0; li < lines.length; li++) if (e.clientY >= lines[li].top && e.clientY <= lines[li].bottom) { r = lines[li]; break; }
    }
    var w = r.width, h = r.height, fx = e.clientX, fy = e.clientY;

    // The clip and the light. A light opens from the finger until it covers the whole shape; a glow is the
    // element's own shape, centred on it and reaching past it.
    var clip, crad = "", L, s = 0;
    if (kind === "light") {
      var box = a.row ? a.row.getBoundingClientRect() : r;
      clip = { x: box.left, y: box.top, w: box.width, h: box.height };
      crad = radiusOf(a.row ? getComputedStyle(a.row) : cs, box.width, box.height);
      var reach = Math.hypot(Math.max(fx - r.left, r.right - fx), Math.max(fy - r.top, r.bottom - fy)) * 2.2;
      L = { x: fx - reach / 2, y: fy - reach / 2, w: reach, h: reach };
    } else {
      s = Math.max(12, Math.min(26, Math.round(Math.min(w, h) * 0.55)));
      L = { x: r.left - s, y: r.top - s, w: w + 2 * s, h: h + 2 * s };
      clip = L;
    }
    var g = region(el);
    var x0 = Math.max(g.x0, clip.x), y0 = Math.max(g.y0, clip.y);
    var x1 = Math.min(g.x1, clip.x + clip.w), y1 = Math.min(g.y1, clip.y + clip.h);
    if (x1 - x0 < 1 || y1 - y0 < 1) return;
    if (x0 !== clip.x || y0 !== clip.y || x1 !== clip.x + clip.w || y1 !== clip.y + clip.h) crad = "";
    var ox = g.fixed ? 0 : scrollX, oy = g.fixed ? 0 : scrollY;

    var node = d.createElement("span"), light = d.createElement("i");
    node.className = "fitaa-press fitaa-press-" + kind + (g.fixed ? " is-fixed" : "") +
      (kind === "light" && vivid(cs) ? " is-sheen" : "") + (kind === "glow" && darkBehind(el) ? " is-screen" : "");
    node.setAttribute("aria-hidden", "true");
    node.style.cssText = "transform:translate(" + (x0 + ox) + "px," + (y0 + oy) + "px);width:" + (x1 - x0) + "px;height:" + (y1 - y0) + "px" +
      (crad !== "" ? ";border-radius:" + crad + "px" : "");
    light.style.cssText = "left:" + (L.x - x0) + "px;top:" + (L.y - y0) + "px;width:" + L.w + "px;height:" + L.h + "px";
    node.appendChild(light);
    root.appendChild(node);
    var p = { node: node, light: light, at: Date.now(), kind: kind, fx: fx, fy: fy, s: s, rect: r, row: a.row ? clip : null };
    move(p, 0, 0, kind === "light" ? 0.25 : 0.7);
    void node.offsetWidth; // start from the closed state, so the opening is seen
    node.className += " is-on";
    move(p, 0, 0, 1);
    p.hold = setTimeout(function () { end(e.pointerId, false); }, HOLD);
    live[e.pointerId] = p;
  }, { passive: true });

  // Moving the finger moves the light: fully inside a button and along a switch, a little for a glow, like light
  // shifting in a stone. A finger that wanders far off what it pressed lets the light go.
  d.addEventListener("pointermove", function (e) {
    var p = live[e.pointerId];
    if (!p) return;
    var dx = e.clientX - p.fx, dy = e.clientY - p.fy, r = p.rect;
    if (!p.row) {
      var far = Math.max(14, Math.min(r.width, r.height) * 0.4);
      if (e.clientX < r.left - far || e.clientX > r.right + far || e.clientY < r.top - far || e.clientY > r.bottom + far) { end(e.pointerId, true); return; }
    }
    p.light.style.transition = "transform .12s linear,opacity .2s ease";
    if (p.kind === "glow") move(p, Math.max(-p.s, Math.min(p.s, dx * 0.25)), Math.max(-p.s, Math.min(p.s, dy * 0.25)), 1);
    else if (p.row) move(p, Math.max(p.row.x - r.left, Math.min(p.row.x + p.row.w - r.right, dx)), 0, 1);
    else move(p, dx, dy, 1);
  }, { passive: true });
  d.addEventListener("pointerup", function (e) { end(e.pointerId, false); }, { passive: true });
  d.addEventListener("pointercancel", function (e) { end(e.pointerId, true); }, { passive: true });
  // A long press that opens the phone's own menu, a drag, or leaving the page never leaves a light behind.
  d.addEventListener("contextmenu", endAll, { passive: true });
  d.addEventListener("dragstart", endAll, { passive: true });
  d.addEventListener("visibilitychange", endAll, { passive: true });
  window.addEventListener("pagehide", endAll, { passive: true });
  window.addEventListener("blur", endAll, { passive: true });
})();
