/* The Fitaa press (SITE_STANDARD.md, Craft in the details). Nigel, 24 Nov 2026: a press should confirm itself
   beautifully, the way a Patek Philippe pusher answers the finger. Nigel, 25 Nov 2026: one soft light, never a second
   effect on top of it, kept where it belongs, and coming from the thing that was pressed.

   It answers in one of two ways, chosen by the shape of what was pressed:
   - light: a button, tile, card, row or switch with a defined edge (a border, a fill or a shadow; its own, a card
     inside it that fills it, or the row it is a segment of) fills with one soft light that opens out from the finger
     until the whole of it is lit, cut to its own outline. A strong fill of its own (a gold or magenta button) catches
     a white sheen instead, because the site's own light would vanish into it (--press-sheen).
   - glow: something with no edge of its own (a logo, an icon, a word, a link, an email address or phone number)
     glows from its own outline: the letters of the word, the strokes of the icon, the edge of the logo. The light
     sits behind it, so it is plainly the word or the symbol that was pressed, not the space around it.
   While the finger rests, moving it moves the light with it, like light shifting in a stone, and on a switch the
   light rides along the row so pressing and sliding are one gesture. The light holds while the finger rests and
   fades when it lifts, when the finger starts to scroll, when a long press opens the phone's own menu, or after 1.5 s
   at most, so it can never be left behind.
   A light inside a fixed or sticky bar that has its own background (a header once it floats over the page, the OS
   section bar) stays inside that bar. Everything else is drawn in the page beside its element, so the browser carries
   it with the page, and every light is cut to the page's width.
   data-press="light" or "glow" overrides the choice, data-press-shape on a part inside names the shape the light
   fills (a tile's photo frame), data-glide marks a switch row, and data-no-press turns the press off.
   A light moves only by transform and opacity, and a glow only by the element's own filter, so nothing in the layout
   moves. Reduced motion gets no answer.
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
    ".fitaa-press.is-fixed{position:fixed}.fitaa-press.is-out{opacity:0}.fitaa-press.is-quick{transition-duration:.14s}" +
    ".fitaa-press i{position:absolute;border-radius:50%;opacity:0;will-change:transform,opacity;transition:" + GROW + "}" +
    ".fitaa-press i{background:radial-gradient(circle," + C + " 0,transparent 68%)}" +
    ".fitaa-press.is-sheen i{background:radial-gradient(circle," + S + " 0,transparent 68%)}" +
    ".fitaa-press.is-on i{opacity:1}";

  var TAPPABLE = 'button,[role="button"],[role="tab"],[role="menuitem"],[role="menuitemradio"],summary,a,label[for],[data-press]';
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

  // A row in a list of rows of the same size where one of them shows its edge (the chosen item in a menu): every
  // row there is a button with a shape, even while its own edge is hidden.
  function kinEdged(el, r) {
    var kids = el.parentElement ? el.parentElement.children : [];
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (k === el || !k.matches || !k.matches(TAPPABLE)) continue;
      var kr = k.getBoundingClientRect();
      if (Math.abs(kr.width - r.width) < 2 && Math.abs(kr.height - r.height) < r.height * 0.5 && edged(getComputedStyle(k))) return true;
    }
    return false;
  }

  // What answers, and inside which shape.
  function answer(el, cs) {
    var set = el.getAttribute("data-press"), marked = el.querySelector("[data-press-shape]");
    var row = set ? null : rowOf(el);
    if (row) return { kind: "light", shape: el, row: row };
    if (set === "glow" || cs.display === "inline") return { kind: "glow" };
    var r = el.getBoundingClientRect();
    if (set === "light" || edged(cs) || (radiusOf(cs, r.width, r.height) > 0 && kinEdged(el, r))) return { kind: "light", shape: marked || el };
    var area = r.width * r.height, kids = el.querySelectorAll("*");
    for (var i = 0; i < kids.length && i < 40; i++) {
      var k = kids[i].getBoundingClientRect();
      if (k.width * k.height >= area * 0.85 && edged(getComputedStyle(kids[i]))) return { kind: "light", shape: kids[i] };
    }
    return { kind: "glow" };
  }

  // Where a light may be drawn: inside a fixed or sticky bar with its own background that holds the element (and
  // never past it), on the screen for anything else that is fixed, or in the page.
  function region(el, r) {
    for (var n = el; n && n !== root; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.position === "fixed" || cs.position === "sticky") {
        var b = n.getBoundingClientRect();
        var holds = r.top >= b.top - 1 && r.bottom <= b.bottom + 1 && r.left >= b.left - 1 && r.right <= b.right + 1;
        if (edged(cs) && holds) return { fixed: true, x0: Math.max(0, b.left), y0: Math.max(0, b.top), x1: Math.min(root.clientWidth, b.right), y1: Math.min(innerHeight, b.bottom) };
        return { fixed: true, x0: 0, y0: 0, x1: root.clientWidth, y1: innerHeight };
      }
    }
    return { fixed: false, x0: 0, y0: -scrollY, x1: root.clientWidth, y1: Math.max(root.scrollHeight - scrollY, innerHeight) };
  }

  // The site's press colour as red, green, blue and alpha, read through a probe so a theme's own value is used.
  var probe;
  function pressColour() {
    if (!probe) { probe = d.createElement("i"); probe.setAttribute("aria-hidden", "true"); probe.style.cssText = "position:absolute;width:0;height:0;color:" + C; }
    root.appendChild(probe);
    var c = rgb(getComputedStyle(probe).color);
    probe.remove();
    return c || { r: 0.38, g: 0.56, b: 0.98, a: 0.24 };
  }
  function rgba(c, a) {
    return "rgba(" + Math.round(c.r * 255) + "," + Math.round(c.g * 255) + "," + Math.round(c.b * 255) + "," + Math.min(1, a).toFixed(2) + ")";
  }

  // A glow: the element's own outline lit from behind by its filter, two soft layers, near and wide. The press colour
  // is see-through so a light can fill a button; a thin outline needs it stronger to be seen.
  function glowFilter(p, dx, dy, on) {
    var near = on ? rgba(p.color, p.color.a * 3) : "transparent", wide = on ? rgba(p.color, p.color.a * 2.2) : "transparent";
    return p.base + "drop-shadow(" + dx + "px " + dy + "px " + (on ? p.blur * 0.3 : 0) + "px " + near + ") drop-shadow(" + dx + "px " + dy + "px " + (on ? p.blur : 0) + "px " + wide + ")";
  }
  function glowTo(p, dx, dy, on, ms) {
    var from = glowFilter(p, p.dx, p.dy, p.on), to = glowFilter(p, dx, dy, on);
    var next = p.el.animate([{ filter: from }, { filter: to }], { duration: ms, easing: EASE, fill: "forwards" });
    if (p.anim) p.anim.cancel();
    p.anim = next; p.dx = dx; p.dy = dy; p.on = on;
    return next;
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
      if (p.kind === "glow") {
        glowTo(p, p.dx, p.dy, false, quick ? 140 : 320).onfinish = function () { if (p.anim) p.anim.cancel(); };
        return;
      }
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
    end(e.pointerId, true);

    var a = answer(el, cs), p = { el: el, at: Date.now(), kind: a.kind, fx: e.clientX, fy: e.clientY, rect: r };
    if (a.kind === "glow") {
      if (!el.animate) return;
      // The glow reaches further from a large word or a logo than from a small icon or a line of small text.
      var size = Math.min(r.height, parseFloat(cs.fontSize) * 1.6 || r.height);
      p.blur = Math.max(6, Math.min(16, Math.round(size * 0.5)));
      p.s = Math.round(p.blur * 0.4);
      p.color = pressColour();
      p.base = cs.filter && cs.filter !== "none" ? cs.filter + " " : "";
      p.dx = 0; p.dy = 0; p.on = false;
      glowTo(p, 0, 0, true, 380);
    } else {
      var shape = a.shape;
      if (shape !== el) { cs = getComputedStyle(shape); r = shape.getBoundingClientRect(); p.rect = r; }
      var fx = e.clientX, fy = e.clientY;
      // The light opens from the finger until it covers the whole shape, cut to the shape or its row.
      var box = a.row ? a.row.getBoundingClientRect() : r;
      var clip = { x: box.left, y: box.top, w: box.width, h: box.height };
      var crad = radiusOf(a.row ? getComputedStyle(a.row) : cs, box.width, box.height);
      var reach = Math.hypot(Math.max(fx - r.left, r.right - fx), Math.max(fy - r.top, r.bottom - fy)) * 2.2;
      var g = region(el, box);
      var x0 = Math.max(g.x0, clip.x), y0 = Math.max(g.y0, clip.y);
      var x1 = Math.min(g.x1, clip.x + clip.w), y1 = Math.min(g.y1, clip.y + clip.h);
      if (x1 - x0 < 1 || y1 - y0 < 1) return;
      if (x0 !== clip.x || y0 !== clip.y || x1 !== clip.x + clip.w || y1 !== clip.y + clip.h) crad = "";
      var ox = g.fixed ? 0 : scrollX, oy = g.fixed ? 0 : scrollY;

      var node = d.createElement("span"), light = d.createElement("i");
      node.className = "fitaa-press" + (g.fixed ? " is-fixed" : "") + (vivid(cs) ? " is-sheen" : "");
      node.setAttribute("aria-hidden", "true");
      node.style.cssText = "transform:translate(" + (x0 + ox) + "px," + (y0 + oy) + "px);width:" + (x1 - x0) + "px;height:" + (y1 - y0) + "px" +
        (crad !== "" ? ";border-radius:" + crad + "px" : "");
      light.style.cssText = "left:" + (fx - reach / 2 - x0) + "px;top:" + (fy - reach / 2 - y0) + "px;width:" + reach + "px;height:" + reach + "px";
      node.appendChild(light);
      root.appendChild(node);
      p.node = node; p.light = light; p.row = a.row ? clip : null;
      move(p, 0, 0, 0.25);
      void node.offsetWidth; // start from the closed state, so the opening is seen
      node.className += " is-on";
      move(p, 0, 0, 1);
    }
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
    if (p.kind === "glow") {
      var gx = Math.round(Math.max(-p.s, Math.min(p.s, dx * 0.2))), gy = Math.round(Math.max(-p.s, Math.min(p.s, dy * 0.2)));
      if (gx !== p.dx || gy !== p.dy) glowTo(p, gx, gy, true, 120);
      return;
    }
    p.light.style.transition = "transform .12s linear,opacity .2s ease";
    if (p.row) move(p, Math.max(p.row.x - r.left, Math.min(p.row.x + p.row.w - r.right, dx)), 0, 1);
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
