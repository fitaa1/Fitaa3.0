/* The Fitaa press (SITE_STANDARD.md, Craft in the details). Nigel, 24 Nov 2026: a press should confirm itself
   beautifully, the way a Patek Philippe pusher answers the finger. Nigel, 25 Nov 2026: bespoke to what is pressed,
   never generic, and the person pressing should feel in control of it.

   Every answer takes the shape of what was pressed and lives as long as the finger does:
   - light: a button, tile or switch with a defined edge (a border, a fill or a shadow; its own, a card inside it
     that fills it, or the row it is a segment of) fills with soft light in its own outline, a rounded rectangle for a
     rounded rectangle and a circle for a circle, opening out from the finger.
   - glow: something that floats with no edge of its own (a logo, an icon, a text link, an email address or phone
     number) is ringed by a soft glow in its own outline, a little larger than itself, opening out from the finger.
     A link inside a sentence glows round the line that was touched.
   A small bright point sits under the finger and follows it while the finger rests or slides, and the answer holds
   until the finger lifts, then fades. On a switch (a row of segments, data-glide or a tablist or group of pressed
   buttons) the light rides along the row with the finger, so pressing and sliding are one gesture. A finger that
   starts to scroll the page lets the answer go at once.
   An element inside a fixed or sticky bar that has its own background (a header once it floats over the page, the
   OS section bar) is answered inside that bar only, never spilling onto the page. Everything else is drawn in the
   page beside its element, so the browser carries it with the page, and every answer is cut to the page's width.
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
  var EASE = "cubic-bezier(.22,1,.36,1)";
  var css =
    ".fitaa-press{position:absolute;left:0;top:0;overflow:hidden;pointer-events:none;z-index:2147483646;contain:layout paint;transition:opacity .3s ease}" +
    ".fitaa-press.is-fixed{position:fixed}" +
    ".fitaa-press.is-out{opacity:0}.fitaa-press.is-quick{transition-duration:.14s}" +
    ".fitaa-press i,.fitaa-press b{position:absolute;left:0;top:0;opacity:0;will-change:transform,opacity}" +
    ".fitaa-press i{background:" + C + ";transition:transform .42s " + EASE + ",opacity .3s " + EASE + "}" +
    ".fitaa-press b{border-radius:50%;background:radial-gradient(circle," + C + " 0," + C + " 30%,transparent 70%);transition:opacity .2s ease}" +
    ".fitaa-press.is-on i{opacity:.9}.fitaa-press-glow.is-on i{opacity:.75}.fitaa-press.is-on b{opacity:1}";

  var TAPPABLE = 'button,[role="button"],[role="tab"],summary,a,label[for],[data-press]';
  var SEGMENT = 'button,[role="tab"],[role="radio"]';
  var ready = false, live = {};

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
    if (row) return { kind: "switch", shape: el, row: row };
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

  function place(node, x, y, scale) {
    node.style.transform = "translate(" + x + "px," + y + "px)" + (scale == null ? "" : " scale(" + scale + ")");
  }

  function end(id, quick) {
    var p = live[id];
    if (!p) return;
    delete live[id];
    var wait = Math.max(0, 170 - (Date.now() - p.at)); // a quick tap still shows its answer opening
    setTimeout(function () {
      p.node.className += quick ? " is-out is-quick" : " is-out";
      setTimeout(function () { p.node.remove(); }, quick ? 180 : 340);
    }, quick ? 0 : wait);
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
    if (kind === "glow" && cs.display === "inline") { // the line of a wrapped link that was touched
      var lines = el.getClientRects();
      for (var li = 0; li < lines.length; li++) if (e.clientY >= lines[li].top && e.clientY <= lines[li].bottom) { r = lines[li]; break; }
    }
    var w = r.width, h = r.height, rad = kind === "glow" && cs.display === "inline" ? h / 2 : radiusOf(cs, w, h);
    var fx = e.clientX, fy = e.clientY, small = Math.min(w, h);

    // The bloom: the pressed thing's own outline, filled (light) or grown round it (glow).
    var bloom, blur, clip, crad = "";
    if (kind === "glow") {
      var s = Math.max(8, Math.min(20, Math.round(small * 0.32)));
      blur = Math.round(s * 0.75);
      bloom = { x: r.left - s, y: r.top - s, w: w + 2 * s, h: h + 2 * s, rad: Math.min(rad + s, (h + 2 * s) / 2) };
      clip = { x: bloom.x - blur * 1.6, y: bloom.y - blur * 1.6, w: bloom.w + blur * 3.2, h: bloom.h + blur * 3.2 };
    } else {
      blur = Math.max(3, Math.min(10, Math.round(small * 0.15)));
      bloom = { x: r.left, y: r.top, w: w, h: h, rad: rad };
      var box = kind === "switch" ? a.row.getBoundingClientRect() : r;
      clip = { x: box.left, y: box.top, w: box.width, h: box.height };
      crad = kind === "switch" ? radiusOf(getComputedStyle(a.row), box.width, box.height) : rad;
    }
    // Cut to where the answer may be drawn.
    var g = region(el);
    var x0 = Math.max(g.x0, clip.x), y0 = Math.max(g.y0, clip.y);
    var x1 = Math.min(g.x1, clip.x + clip.w), y1 = Math.min(g.y1, clip.y + clip.h);
    if (x1 - x0 < 1 || y1 - y0 < 1) return;
    if (x0 !== clip.x || y0 !== clip.y || x1 !== clip.x + clip.w || y1 !== clip.y + clip.h) crad = "";
    var ox = g.fixed ? 0 : scrollX, oy = g.fixed ? 0 : scrollY;

    var node = d.createElement("span"), fill = d.createElement("i"), point = d.createElement("b");
    node.className = "fitaa-press fitaa-press-" + kind + (g.fixed ? " is-fixed" : "");
    node.setAttribute("aria-hidden", "true");
    place(node, x0 + ox, y0 + oy);
    node.style.width = (x1 - x0) + "px";
    node.style.height = (y1 - y0) + "px";
    if (crad !== "") node.style.borderRadius = crad + "px";
    fill.style.cssText = "width:" + bloom.w + "px;height:" + bloom.h + "px;border-radius:" + bloom.rad + "px;filter:blur(" + blur + "px);transform-origin:" +
      (fx - bloom.x) + "px " + (fy - bloom.y) + "px";
    var bx = bloom.x - x0, by = bloom.y - y0;
    place(fill, bx, by, kind === "glow" ? 0.55 : 0.15);
    var pd = Math.max(28, Math.min(kind === "glow" ? 72 : 110, Math.round(small * (kind === "glow" ? 1 : 1.2))));
    point.style.cssText = "width:" + pd + "px;height:" + pd + "px";
    place(point, fx - x0 - pd / 2, fy - y0 - pd / 2);
    node.appendChild(fill);
    node.appendChild(point);
    root.appendChild(node);
    void node.offsetWidth; // start from the closed state, so the opening is seen
    node.className += " is-on";
    place(fill, bx, by, kind === "light" ? 1.06 : 1);

    var p = live[e.pointerId] = { node: node, fill: fill, point: point, at: Date.now(), kind: kind, x0: x0, y0: y0, bx: bx, by: by, pd: pd, fx: fx, fy: fy,
      lo: kind === "switch" ? clip.x - r.left : 0, hi: kind === "switch" ? clip.x + clip.w - r.right : 0, rect: r };
    if (kind === "switch") fill.style.transition = "transform .42s " + EASE + ",opacity .3s " + EASE;
  }, { passive: true });

  // The point follows the finger, the light rides along a switch with it, and a finger that wanders far off what it
  // pressed lets the answer go.
  d.addEventListener("pointermove", function (e) {
    var p = live[e.pointerId];
    if (!p) return;
    place(p.point, e.clientX - p.x0 - p.pd / 2, e.clientY - p.y0 - p.pd / 2);
    if (p.kind === "switch") {
      p.fill.style.transition = "transform .08s linear,opacity .3s " + EASE;
      place(p.fill, p.bx + Math.max(p.lo, Math.min(p.hi, e.clientX - p.fx)), p.by, 1.06);
      return;
    }
    var far = Math.max(14, Math.min(p.rect.width, p.rect.height) * 0.4);
    if (e.clientX < p.rect.left - far || e.clientX > p.rect.right + far || e.clientY < p.rect.top - far || e.clientY > p.rect.bottom + far) end(e.pointerId, true);
  }, { passive: true });
  d.addEventListener("pointerup", function (e) { end(e.pointerId, false); }, { passive: true });
  d.addEventListener("pointercancel", function (e) { end(e.pointerId, true); }, { passive: true });
})();
